document.addEventListener('DOMContentLoaded', function () {
    let pedidoId = 0;
    cargarDatosGuardados();

    document.getElementById('calcular_cambio').addEventListener('click', function () {
        const precio = parseFloat(document.getElementById('precio').value) || 0;
        const meDa = parseFloat(document.getElementById('me_da').value) || 0;
        const cambioADevolver = meDa - precio;
        document.getElementById('cambio_a_devolver').textContent = cambioADevolver.toFixed(2) + ' €';
    });

    document.getElementById('calcular_sobra').addEventListener('click', function () {
        const precio = parseFloat(document.getElementById('precio').value) || 0;
        const meDa = parseFloat(document.getElementById('me_da').value) || 0;
        const leDoy = parseFloat(document.getElementById('le_doy').value) || 0;
        const cambioADevolver = meDa - precio;
        const sobra = cambioADevolver > leDoy ? cambioADevolver - leDoy : 0;

        pedidoId++;
        agregarAFila(pedidoId, precio, meDa, cambioADevolver, leDoy, sobra);

        // Vaciar campos
        document.getElementById('precio').value = '';
        document.getElementById('me_da').value = '';
        document.getElementById('le_doy').value = '';
        document.getElementById('cambio_a_devolver').textContent = '0.00 €';
        M.updateTextFields(); // Actualiza los campos para Materialize
    });

    document.getElementById('borrar_datos').addEventListener('click', function () {
        if (confirm('¿Estás seguro de que quieres borrar todos los datos?')) {
            localStorage.clear();
            document.getElementById('tabla_pedidos').innerHTML = '';
            pedidoId = 0;
        }
    });
});

function agregarAFila(id, precio, meDa, cambioADevolver, leDoy, sobra) {
    const fila = `<tr>
                    <td>${id}</td>
                    <td>${precio.toFixed(2)} €</td>
                    <td>${meDa.toFixed(2)} €</td>
                    <td>${cambioADevolver.toFixed(2)} €</td>
                    <td>${leDoy.toFixed(2)} €</td>
                    <td>${sobra.toFixed(2)} €</td>
                  </tr>`;
    document.getElementById('tabla_pedidos').innerHTML += fila;
    guardarDatos();
}

function guardarDatos() {
    const tablaHtml = document.getElementById('tabla_pedidos').innerHTML;
    localStorage.setItem('tablaPedidos', tablaHtml);
}

function cargarDatosGuardados() {
    const datosGuardados = localStorage.getItem('tablaPedidos');
    if (datosGuardados) {
        document.getElementById('tabla_pedidos').innerHTML = datosGuardados;
        pedidoId = document.getElementById('tabla_pedidos').rows.length;
    }
}

document.getElementById('exportar_pdf').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Añadir fecha
    const fechaHoy = new Date().toLocaleDateString();
    doc.text(`Fecha: ${fechaHoy}`, 10, 10);

    // Obtener los datos de la tabla
    const tabla = document.getElementById('tabla_pedidos');
    const filas = tabla.getElementsByTagName('tr');
    const datosTabla = Array.from(filas).map(tr => 
        Array.from(tr.getElementsByTagName('td')).map(td => td.textContent)
    );

    // Añadir tabla al PDF
    doc.autoTable({
        head: [['Nº', 'Precio', 'Me Da', 'Cambio a Devolver', 'Le Doy', 'Sobra']],
        body: datosTabla,
        startY: 20
    });

    doc.save(`Reporte-${fechaHoy}.pdf`);
});
