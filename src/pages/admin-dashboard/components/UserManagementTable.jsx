import React, { useEffect, useMemo, useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { supabase } from "../../../lib/supabase";

// -------------------------------------------------------
// CONST
// -------------------------------------------------------
const PAGE_SIZE = 20;

// -------------------------------------------------------
// UTIL
// -------------------------------------------------------
const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("ro-RO") : "-";

// 👉 BLINDAT: nu mai crapă dacă email e null / undefined
const safeName = (p = {}) => {
  if (p.full_name) return p.full_name;

  const nm = `${p.first_name || ""} ${p.last_name || ""}`.trim();
  if (nm) return nm;

  if (p.email) {
    const atIndex = p.email.indexOf("@");
    if (atIndex > 0) return p.email.slice(0, atIndex);
    return p.email;
  }

  return "Utilizator fără nume";
};

// -------------------------------------------------------
// COMPONENT
// -------------------------------------------------------
const UserManagementTable = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openUser, setOpenUser] = useState(null);
  const [customMessage, setCustomMessage] = useState("");

  // lazy-load flag + paginare
  const [hasLoaded, setHasLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const sendSystemEmail = async (email, subject, message) => {
    try {
      const res = await fetch(
        "https://lhcettqvfpcamdsymvjk.supabase.co/functions/v1/notify-user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, subject, message }),
        }
      );

      const data = await res.text();

      if (!res.ok) {
        console.error("EROARE FUNCȚIE:", data);
        alert("Nu s-a trimis emailul");
      } else {
        console.log("TRIMIS:", data);
      }
    } catch (e) {
      console.error("Eroare:", e);
    }
  };

  // -------------------------------------------------------
  // LOAD DATA (toți utilizatorii)
  // -------------------------------------------------------
  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data: profiles, error: profileError } = await supabase
        .from("user_profiles")
        .select("*");

      if (profileError) throw profileError;

      const { data: roles, error: rolesError } = await supabase
        .from("roles")
        .select("id, name");

      if (rolesError) throw rolesError;

      const { data: userRoles, error: userRolesError } = await supabase
        .from("user_roles")
        .select("user_id, role_id");

      if (userRolesError) throw userRolesError;

      const { data: subs, error: subsError } = await supabase
        .from("subscriptions")
        .select("*");

      if (subsError) throw subsError;

      // payments poate să nu existe încă -> fallback pe []
      let payments = [];
      try {
        const { data: payData, error: payError } = await supabase
          .from("payments")
          .select("*");
        if (!payError && payData) {
          payments = payData;
        } else if (payError) {
          console.warn("Tabela payments lipsește sau are eroare:", payError.message);
        }
      } catch (e) {
        console.warn("Nu s-a putut încărca tabela payments (probabil nu există încă).", e);
      }

      const { data: events, error: eventsError } = await supabase
        .from("analytics_events")
        .select("user_id, created_at")
        .order("created_at", { ascending: false });

      if (eventsError) throw eventsError;

      const final = (profiles || []).map((p) => {
        const userSubs = (subs || []).filter((s) => s.user_id === p.id);
        const finalSub = userSubs[userSubs.length - 1];

        const roleNames = (userRoles || [])
          .filter((ur) => ur.user_id === p.id)
          .map(
            (ur) =>
              (roles || []).find((rr) => rr.id === ur.role_id)?.name || "user"
          );

        return {
          ...p,
          id: p.id,
          name: safeName(p),
          roles: roleNames.length ? roleNames : ["user"],
          subscriptions: userSubs,
          payments: payments.filter((pay) => pay.user_id === p.id),
          sub_label: finalSub
            ? `${finalSub.plan_name} (${finalSub.status})`
            : "Free",
          last_active:
            events?.find((e) => e.user_id === p.id)?.created_at || null,
        };
      });

      setRows(final);
      setHasLoaded(true);
      setError(null);
    } catch (err) {
      console.error("Eroare la fetchAll:", err);
      setError("Eroare încărcare: " + (err?.message || "necunoscută"));
    }
    setLoading(false);
  };

  // Când utilizatorul începe să caute și nu avem date încă,
  // încărcăm o singură dată lista completă
  useEffect(() => {
    if (!hasLoaded && searchTerm.trim() !== "") {
      const load = async () => {
        await fetchAll();
      };
      load();
    }
  }, [searchTerm, hasLoaded]);

  // reset pagină la schimbare filtre / search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // -------------------------------------------------------
  // HELPERS
  // -------------------------------------------------------
  const getAdminCount = () =>
    rows.filter((u) => u.roles.includes("admin")).length;

  // -------------------------------------------------------
  // AUTH / PROFILE ACTIONS
  // -------------------------------------------------------
  const resendConfirmation = async (email) => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/verify-email`,
      },
    });

    if (error) {
      console.error(error);
      alert("Nu s-a putut retrimite emailul.");
      return;
    }

    alert("Emailul a fost retrimis!");
  };

  const sendPasswordReset = async (email) => {
    await supabase.auth.resetPasswordForEmail(email);
    alert("Email de resetare parolă trimis");
  };

  const confirmEmailManual = async (id) => {
    await supabase
      .from("user_profiles")
      .update({ email_verified: true })
      .eq("id", id);
    fetchAll();
  };

  const deleteUser = async (id) => {
    if (!confirm("Sigur ștergi acest cont?")) return;

    try {
      const res = await fetch(
        "https://lhcettqvfpcamdsymvjk.supabase.co/functions/v1/delete-user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: id }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Eroare delete:", data);
        alert("Nu s-a putut șterge userul.");
        return;
      }

      alert("User șters cu succes.");
      fetchAll();
    } catch (e) {
      console.error("Eșec request:", e);
      alert("Eroare conexiune.");
    }
  };

  const suspendUser = async (id, email) => {
    await supabase
      .from("user_profiles")
      .update({ is_active: false })
      .eq("id", id);

    await sendSystemEmail(
      email,
      "Contul tău a fost suspendat",
      "Contul tău a fost suspendat temporar de către administrator.<br>Te rugăm să ne contactezi pentru detalii."
    );

    fetchAll();
  };

  const activateUser = async (id, email) => {
    await supabase
      .from("user_profiles")
      .update({ is_active: true })
      .eq("id", id);

    await sendSystemEmail(
      email,
      "Contul tău a fost reactivat",
      "Salut! Contul tău a fost reactivat și îl poți folosi din nou. Bine ai revenit!"
    );

    fetchAll();
  };

  const makeAdmin = async (id) => {
    const { data: r } = await supabase
      .from("roles")
      .select("id")
      .eq("name", "admin")
      .single();
    if (!r) return;

    await supabase.from("user_roles").insert({ user_id: id, role_id: r.id });
    fetchAll();
  };

  const removeAdmin = async (id) => {
    if (getAdminCount() === 1) {
      alert("Nu poți elimina ultimul admin!");
      return;
    }

    const { data: r } = await supabase
      .from("roles")
      .select("id")
      .eq("name", "admin")
      .single();
    if (!r) return;

    await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", id)
      .eq("role_id", r.id);
    fetchAll();
  };

  // -------------------------------------------------------
  // SUBSCRIPTIONS
  // -------------------------------------------------------
  const grantPremium = async (userId) => {
    await supabase.from("subscriptions").insert({
      user_id: userId,
      plan_name: "Premium",
      status: "active",
      started_at: new Date(),
    });
    fetchAll();
  };

  const giveTrial = async (userId, days) => {
    await supabase.from("subscriptions").insert({
      user_id: userId,
      plan_name: "Trial",
      status: "active",
      expires_at: new Date(Date.now() + days * 86400000),
    });
    fetchAll();
  };

  const removeSubscription = async (userId) => {
    await supabase.from("subscriptions").delete().eq("user_id", userId);
    fetchAll();
  };

  // -------------------------------------------------------
  // SEND CUSTOM EMAIL
  // -------------------------------------------------------
  const sendCustomEmail = (email, msg) => {
    if (!msg.trim()) {
      alert("Mesajul nu poate fi gol.");
      return;
    }
    alert(`Email trimis către ${email}: ${msg}`);
  };

  // -------------------------------------------------------
  // FILTERING + PAGINATION
  // -------------------------------------------------------
  const filtered = useMemo(() => {
    const t = searchTerm.toLowerCase();
    return rows.filter((u) => {
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();

      const match = name.includes(t) || email.includes(t);

      let status = true;
      if (statusFilter === "active") status = u.is_active;
      if (statusFilter === "inactive") status = !u.is_active;

      return match && status;
    });
  }, [rows, searchTerm, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil((filtered?.length || 0) / PAGE_SIZE)
  );

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // -------------------------------------------------------
  // UI
  // -------------------------------------------------------
  if (loading && !hasLoaded) {
    return <p className="p-6">Se încarcă…</p>;
  }
  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      {/* FILTER BAR */}
      <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Icon name="Users" size={18} />
          Management utilizatori
        </h3>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <Input
            placeholder="Caută nume sau email…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-72"
          />

          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "all", label: "Toate" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
            className="w-40"
          />

          <Button
            variant="outline"
            onClick={() => {
              if (!hasLoaded) {
                fetchAll(); // încarcă lista
              } else {
                // ascunde lista
                setHasLoaded(false);
                setRows([]);
                setOpenUser(null);
                setSearchTerm("");
                setCurrentPage(1);
              }
            }}
            disabled={loading}
          >
            {!hasLoaded ? "Încarcă utilizatorii" : "Ascunde utilizatorii"}
          </Button>
        </div>
      </div>

      {/* Dacă nu am încărcat încă lista */}
      {!hasLoaded && !loading && (
        <div className="p-6 text-sm text-muted-foreground">
          Nu ai încărcat încă lista de utilizatori. Apasă pe{" "}
          <strong>„Încarcă utilizatorii”</strong> sau începe să cauți după nume
          / email.
        </div>
      )}

      {/* TABLE */}
      {hasLoaded && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/20">
              <tr>
                <th className="p-4"></th>
                <th className="p-4 text-left">Utilizator</th>
                <th className="p-4 text-left">Abonament</th>
                <th className="p-4 text-left">Roluri</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Creat la</th>
                <th className="p-4 text-left">Ultima activitate</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((u) => (
                <React.Fragment key={u.id}>
                  {/* ROW */}
                  <tr
                    className="border-b border-border hover:bg-muted/10 cursor-pointer"
                    onClick={() =>
                      setOpenUser(openUser === u.id ? null : u.id)
                    }
                  >
                    <td className="p-4">
                      <Icon
                        name={
                          openUser === u.id ? "ChevronDown" : "ChevronRight"
                        }
                        size={18}
                        className="text-muted-foreground"
                      />
                    </td>

                    <td className="p-4">
                      <p className="font-medium">{u.name}</p>
                      <p className="text-muted-foreground">{u.email}</p>
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                        {u.sub_label}
                      </span>
                    </td>

                    <td className="p-4">{u.roles.join(", ")}</td>

                    <td className="p-4">
                      <span
                        className={
                          u.is_active
                            ? "px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium"
                            : "px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-medium"
                        }
                      >
                        {u.is_active ? "Activ" : "Suspendat"}
                      </span>
                    </td>

                    <td className="p-4">{formatDate(u.created_at)}</td>
                    <td className="p-4">{formatDate(u.last_active)}</td>
                  </tr>

                  {/* DETAILS PANEL */}
                  {openUser === u.id && (
                    <tr className="border-b border-border bg-muted/10">
                      <td colSpan={7} className="p-6">
                        {/* HEADER */}
                        <h4 className="text-lg font-semibold mb-1">
                          Detalii utilizator
                        </h4>
                        <p className="text-muted-foreground text-sm mb-4">
                          ID: {u.id}
                        </p>

                        {/* GRID */}
                        <div className="grid sm:grid-cols-2 gap-8 mb-8">
                          {/* PROFILE */}
                          <div>
                            <h5 className="font-semibold mb-2 flex items-center gap-2">
                              <Icon name="User" size={16} /> Profil
                            </h5>
                            <p>
                              Nume: <strong>{u.name}</strong>
                            </p>
                            <p>Email: {u.email}</p>
                            <p>Roluri: {u.roles.join(", ")}</p>
                            <p>
                              Status: {u.is_active ? "Activ" : "Suspendat"}
                            </p>
                            <p>
                              Email verificat:{" "}
                              {u.email_verified ? "Da" : "Nu"}
                            </p>
                            <p>
                              Termeni acceptați:{" "}
                              {u.accepted_terms ? "Da" : "Nu"}
                            </p>
                            <p>
                              Data acceptării:{" "}
                              {formatDate(u.accepted_terms_at)}
                            </p>
                            <p>Creat la: {formatDate(u.created_at)}</p>
                          </div>

                          {/* ACTIVITY & SUBSCRIPTIONS */}
                          <div>
                            <h5 className="font-semibold mb-2 flex items-center gap-2">
                              <Icon name="Activity" size={16} /> Activitate
                            </h5>
                            <p>
                              Ultima activitate:{" "}
                              {formatDate(u.last_active)}
                            </p>

                            <h5 className="font-semibold mt-4 mb-2 flex items-center gap-2">
                              <Icon name="CreditCard" size={16} /> Abonament
                              curent
                            </h5>
                            <p>{u.sub_label}</p>

                            <h5 className="font-semibold mt-4 mb-2 flex items-center gap-2">
                              <Icon name="Calendar" size={16} /> Istoric
                              abonamente
                            </h5>

                            <ul className="text-sm pl-4 list-disc">
                              {u.subscriptions.map((s) => (
                                <li key={s.id}>
                                  {s.plan_name} — {s.status} —{" "}
                                  {formatDate(s.started_at)}
                                </li>
                              ))}
                            </ul>

                            {u.payments && u.payments.length > 0 && (
                              <>
                                <h5 className="font-semibold mt-4 mb-2 flex items-center gap-2">
                                  <Icon name="DollarSign" size={16} /> Total
                                  plăți
                                </h5>
                                <p>
                                  {u.payments.reduce(
                                    (acc, p) => acc + (p.amount || 0),
                                    0
                                  )}{" "}
                                  RON
                                </p>
                              </>
                            )}
                          </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex flex-wrap gap-3 mb-6">
                          {/* Activează / Suspendă */}
                          {u.is_active ? (
                            <Button
                              variant="outline"
                              onClick={() => suspendUser(u.id, u.email)}
                            >
                              Suspendă
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              onClick={() => activateUser(u.id, u.email)}
                            >
                              Activează
                            </Button>
                          )}

                          {/* Admin */}
                          {!u.roles.includes("admin") ? (
                            <Button
                              variant="outline"
                              onClick={() => makeAdmin(u.id)}
                            >
                              Fă admin
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              onClick={() => removeAdmin(u.id)}
                            >
                              Scoate admin
                            </Button>
                          )}

                          {/* Confirm email */}
                          {!u.email_verified && (
                            <Button
                              variant="outline"
                              onClick={() => confirmEmailManual(u.id)}
                            >
                              Confirmă email manual
                            </Button>
                          )}

                          {/* Retrimite confirmare */}
                          <Button
                            variant="outline"
                            onClick={() => resendConfirmation(u.email)}
                          >
                            Retrimite email confirmare
                          </Button>

                          {/* Resetare parolă */}
                          <Button
                            variant="outline"
                            onClick={() => sendPasswordReset(u.email)}
                          >
                            Resetare parolă
                          </Button>

                          {/* Delete */}
                          <Button
                            variant="destructive"
                            onClick={() => deleteUser(u.id)}
                          >
                            Șterge cont
                          </Button>
                        </div>

                        {/* ABONAMENTE */}
                        <div className="p-4 bg-white rounded-lg border mb-6">
                          <h5 className="font-semibold mb-3 flex items-center gap-2">
                            <Icon name="Crown" size={16} /> Administrare
                            abonamente
                          </h5>

                          <div className="flex flex-wrap gap-3">
                            <Button onClick={() => grantPremium(u.id)}>
                              Acordă Premium
                            </Button>

                            <Button onClick={() => giveTrial(u.id, 7)}>
                              Acordă trial 7 zile
                            </Button>

                            <Button
                              variant="destructive"
                              onClick={() => removeSubscription(u.id)}
                            >
                              Elimină abonament
                            </Button>
                          </div>
                        </div>

                        {/* NOTIFICĂRI / EMAIL CUSTOM */}
                        <div className="p-4 bg-white rounded-lg border">
                          <h5 className="font-semibold mb-3 flex items-center gap-2">
                            <Icon name="Mail" size={16} /> Notificări & email
                            custom
                          </h5>

                          <Input
                            placeholder="Mesaj custom către utilizator"
                            value={customMessage}
                            onChange={(e) =>
                              setCustomMessage(e.target.value)
                            }
                            className="mb-3"
                          />

                          <Button
                            onClick={() =>
                              sendCustomEmail(u.email, customMessage)
                            }
                          >
                            Trimite email
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}

              {hasLoaded && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-6 text-center text-muted-foreground"
                  >
                    Niciun utilizator găsit pentru criteriile curente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      {hasLoaded && filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-border gap-3 text-sm">
          <span className="text-muted-foreground">
            Pagina {currentPage} din {totalPages} • Afișați {PAGE_SIZE} /
            pagină • Total {filtered.length} utilizatori
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <Icon name="ChevronLeft" size={16} /> Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
            >
              Următor <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementTable;
