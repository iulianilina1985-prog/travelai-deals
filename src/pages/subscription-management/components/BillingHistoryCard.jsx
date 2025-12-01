import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const BillingHistoryCard = ({ billingHistory, onDownloadInvoice }) => {
  const [expandedInvoice, setExpandedInvoice] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-success/10 text-success";
      case "pending":
        return "bg-warning/10 text-warning";
      case "failed":
        return "bg-error/10 text-error";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return "CheckCircle";
      case "pending":
        return "Clock";
      case "failed":
        return "XCircle";
      default:
        return "Circle";
    }
  };

  const toggleInvoiceDetails = (invoiceId) => {
    setExpandedInvoice(expandedInvoice === invoiceId ? null : invoiceId);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
          <Icon name="Receipt" size={20} color="var(--color-secondary)" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Istoric plăți</h3>
          <p className="text-sm text-muted-foreground">
            Facturile și plățile tale
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {billingHistory?.map((invoice) => (
          <div
            key={invoice?.id}
            className="border border-border rounded-lg overflow-hidden"
          >
            <div
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleInvoiceDetails(invoice?.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Icon
                    name={getStatusIcon(invoice?.status)}
                    size={20}
                    color={
                      invoice?.status === "paid"
                        ? "var(--color-success)"
                        : invoice?.status === "pending"
                        ? "var(--color-warning)"
                        : "var(--color-error)"
                    }
                  />

                  <div>
                    <div className="font-medium text-foreground">
                      Factura #{invoice?.invoice_number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(invoice?.payment_date).toLocaleDateString(
                        "ro-RO"
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="font-semibold text-foreground">
                      {invoice?.amount} {invoice?.currency}
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                        invoice?.status
                      )}`}
                    >
                      {invoice?.status
                        ?.charAt(0)
                        ?.toUpperCase() + invoice?.status?.slice(1)}
                    </div>
                  </div>
                  <Icon
                    name={
                      expandedInvoice === invoice?.id
                        ? "ChevronUp"
                        : "ChevronDown"
                    }
                    size={16}
                    color="var(--color-muted-foreground)"
                  />
                </div>
              </div>
            </div>

            {expandedInvoice === invoice?.id && (
              <div className="px-4 pb-4 border-t border-border bg-muted/20">
                <div className="mt-4 text-sm text-muted-foreground">
                  <strong>ID Stripe:</strong> {invoice?.stripe_invoice_id || "-"}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownloadInvoice(invoice?.stripe_invoice_id)}
                    iconName="Download"
                    iconPosition="left"
                  >
                    Download PDF
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {billingHistory?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Receipt" size={48} color="var(--color-muted-foreground)" />
          <p className="text-muted-foreground mt-2">
            Nu există plăți înregistrate.
          </p>
        </div>
      )}
    </div>
  );
};

export default BillingHistoryCard;
