import React from "react";

const FirmPrint = ({
  firm,
  groupedOrders,
  groupedPayments,
  totalOrders,
  totalPayments,
  debt,
}) => {
  const today = new Date().toLocaleDateString("sq-AL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      id="print-area"
      style={{
        fontFamily: "Arial, sans-serif",
        color: "#000",
        padding: "20px 40px",
        lineHeight: 1.4,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "20px",
          borderBottom: "1px solid #ccc",
          paddingBottom: "10px",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: "18px" }}>
            {firm?.name || "Firma"} - Raport Financiar
          </h2>
          <p style={{ margin: "2px 0", fontSize: "13px" }}>
            Gjeneruar më: {today}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: "35px" }}>
        <h3
          style={{
            marginBottom: "10px",
            fontSize: "16px",
            borderBottom: "1px solid #ccc",
            paddingBottom: "5px",
          }}
        >
          Porositë
        </h3>

        {Object.entries(groupedOrders).length === 0 ? (
          <p style={{ fontSize: "13px", color: "#444" }}>
            Nuk ka porosi të regjistruara.
          </p>
        ) : (
          Object.entries(groupedOrders).map(([month, monthOrders]) => {
            const totalMonth = monthOrders.reduce(
              (sum, o) => sum + Number(o.total_amount),
              0
            );
            return (
              <div key={month} style={{ marginBottom: "20px" }}>
                <h4
                  style={{
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {month}
                </h4>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "13px",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "6px",
                          textAlign: "left",
                        }}
                      >
                        Data
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "6px",
                          textAlign: "center",
                        }}
                      >
                        Nr. Personave
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "6px",
                          textAlign: "center",
                        }}
                      >
                        Çmimi (€)
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "6px",
                          textAlign: "center",
                        }}
                      >
                        Totali (€)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthOrders.map((o) => (
                      <tr key={o.id}>
                        <td
                          style={{
                            border: "1px solid #000",
                            padding: "5px 6px",
                            textAlign: "left",
                          }}
                        >
                          {o.date}
                        </td>
                        <td
                          style={{
                            border: "1px solid #000",
                            padding: "5px 6px",
                            textAlign: "center",
                          }}
                        >
                          {o.persons}
                        </td>
                        <td
                          style={{
                            border: "1px solid #000",
                            padding: "5px 6px",
                            textAlign: "center",
                          }}
                        >
                          {o.price_per_person}
                        </td>
                        <td
                          style={{
                            border: "1px solid #000",
                            padding: "5px 6px",
                            textAlign: "center",
                          }}
                        >
                          {o.total_amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p
                  style={{
                    textAlign: "right",
                    fontSize: "13px",
                    marginTop: "5px",
                  }}
                >
                  Totali për {month.toLowerCase()}:{" "}
                  <strong>{totalMonth.toFixed(2)} €</strong>
                </p>
              </div>
            );
          })
        )}

        <p
          style={{
            textAlign: "right",
            fontSize: "14px",
            fontWeight: "bold",
            borderTop: "1px solid #000",
            paddingTop: "8px",
          }}
        >
          Totali i Porosive: {totalOrders.toFixed(2)} €
        </p>
      </div>

      <div style={{ marginBottom: "25px" }}>
        <h3
          style={{
            marginBottom: "10px",
            fontSize: "16px",
            borderBottom: "1px solid #ccc",
            paddingBottom: "5px",
          }}
        >
          Pagesat
        </h3>

        {Object.entries(groupedPayments).length === 0 ? (
          <p style={{ fontSize: "13px", color: "#444" }}>
            Nuk ka pagesa të regjistruara.
          </p>
        ) : (
          Object.entries(groupedPayments).map(([month, monthPayments]) => {
            const totalMonth = monthPayments.reduce(
              (sum, p) => sum + Number(p.amount),
              0
            );
            return (
              <div key={month} style={{ marginBottom: "20px" }}>
                <h4
                  style={{
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {month}
                </h4>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "13px",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "6px",
                          textAlign: "left",
                        }}
                      >
                        Data
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "6px",
                          textAlign: "center",
                        }}
                      >
                        Shuma (€)
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "6px",
                          textAlign: "center",
                        }}
                      >
                        Metoda
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthPayments.map((p) => (
                      <tr key={p.id}>
                        <td
                          style={{
                            border: "1px solid #000",
                            padding: "5px 6px",
                            textAlign: "left",
                          }}
                        >
                          {p.date}
                        </td>
                        <td
                          style={{
                            border: "1px solid #000",
                            padding: "5px 6px",
                            textAlign: "center",
                          }}
                        >
                          {p.amount}
                        </td>
                        <td
                          style={{
                            border: "1px solid #000",
                            padding: "5px 6px",
                            textAlign: "center",
                          }}
                        >
                          {p.method}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p
                  style={{
                    textAlign: "right",
                    fontSize: "13px",
                    marginTop: "5px",
                  }}
                >
                  Totali për {month.toLowerCase()}:{" "}
                  <strong>{totalMonth.toFixed(2)} €</strong>
                </p>
              </div>
            );
          })
        )}

        <p
          style={{
            textAlign: "right",
            fontSize: "14px",
            fontWeight: "bold",
            borderTop: "1px solid #000",
            paddingTop: "8px",
          }}
        >
          Totali i Pagesave: {totalPayments.toFixed(2)} €
        </p>
      </div>

      <div
        style={{
          textAlign: "right",
          fontSize: "15px",
          fontWeight: "bold",
          borderTop: "1px solid #000",
          paddingTop: "10px",
        }}
      >
        Borxhi aktual:{" "}
        <span style={{ color: debt > 0 ? "red" : "green" }}>
          {debt.toFixed(2)} €
        </span>
      </div>
    </div>
  );
};

export default FirmPrint;
