<!DOCTYPE html>
<html lang="sq">
<head>
    <meta charset="UTF-8">
    <title>Raporti Mujor - {{ $month }}/{{ $year }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 13px;
            color: #222;
            margin: 40px;
        }
        h1, h3 {
            text-align: center;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 25px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #777;
            padding: 8px;
            text-align: center;
        }
        th {
            background-color: #d9e1f2;
            color: #000;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        .footer {
            margin-top: 40px;
            text-align: right;
            font-weight: bold;
        }
        .summary {
            background-color: #ececec;
            font-weight: bold;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>Gjelltore “Naimi 2000”</h1>
        <h3>Raport Mujor Financiar</h3>
        <p>Muaji: {{ $month }} / Viti: {{ $year }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Emri i Firmës</th>
                <th>Totali i Porosive (€)</th>
                <th>Totali i Pagesave (€)</th>
                <th>Borxhi (€)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($firms as $index => $firm)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $firm['name'] }}</td>
                <td>{{ number_format($firm['total_orders'], 2) }}</td>
                <td>{{ number_format($firm['total_payments'], 2) }}</td>
                <td>{{ number_format($firm['debt'], 2) }}</td>
            </tr>
            @endforeach
            <tr class="summary">
                <td colspan="4">Totali i Përgjithshëm i Borxheve</td>
                <td>{{ number_format($grandTotal, 2) }} €</td>
            </tr>
        </tbody>
    </table>

    <div class="footer">
        <p>Ferizaj, {{ now()->format('d/m/Y') }}</p>
        <p>Menaxheri: ____________________</p>
    </div>

</body>
</html>
