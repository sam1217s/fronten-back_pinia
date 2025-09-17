<template>
  <div class="q-pa-md">
    <q-table
      class="my-sticky-header-table"
      flat
      bordered
      title="Gestión de Ventas"
      :rows="rowsVentas"
      :columns="columns"
      row-key="_id"
    >
      <template v-slot:body-cell-fecha="props">
        <q-td :props="props">
          <q-chip 
            color="info" 
            text-color="white"
            :label="formatearFecha(props.row.fecha)"
            icon="event"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-cliente="props">
        <q-td :props="props">
          <div class="text-primary">
            {{ props.row.cliente?.nombre || 'Cliente no disponible' }}
          </div>
          <div class="text-caption text-grey">
            Doc: {{ props.row.cliente?.documento || 'N/A' }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-productos="props">
        <q-td :props="props">
          <div v-for="producto in props.row.producto" :key="producto._id" class="q-mb-xs">
            <q-chip 
              color="secondary" 
              text-color="white"
              size="sm"
            >
              {{ producto.cantidad }}x {{ producto.nombre }}
            </q-chip>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-total="props">
        <q-td :props="props">
          <div class="text-weight-bold text-positive text-h6">
            ${{ Number(props.row.precioTotal).toLocaleString() }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-options="props">
        <q-td :props="props">
          <q-btn 
            flat 
            round 
            dense 
            color="primary" 
            icon="visibility"
            size="sm"
            @click="verDetalle(props.row)"
          />
        </q-td>
      </template>
    </q-table>

    <!-- Modal ver detalle -->
    <q-dialog v-model="showModal">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Detalle de Venta</div>
        </q-card-section>

        <q-card-section v-if="ventaSeleccionada">
          <div class="q-gutter-md">
            <div><strong>Fecha:</strong> {{ formatearFecha(ventaSeleccionada.fecha) }}</div>
            <div><strong>Cliente:</strong> {{ ventaSeleccionada.cliente?.nombre || 'N/A' }}</div>
            <div><strong>Documento:</strong> {{ ventaSeleccionada.cliente?.documento || 'N/A' }}</div>
            
            <div class="q-mt-md">
              <strong>Productos:</strong>
              <q-list>
                <q-item v-for="producto in ventaSeleccionada.producto" :key="producto._id">
                  <q-item-section>
                    <q-item-label>{{ producto.nombre }}</q-item-label>
                    <q-item-label caption>Cantidad: {{ producto.cantidad }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            
            <div class="q-mt-md text-h6">
              <strong>Total: ${{ Number(ventaSeleccionada.precioTotal).toLocaleString() }}</strong>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" @click="cerrarModal" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { getData, postData, putData } from "../services/apiClient.js";

const rowsVentas = ref([]);
const showModal = ref(false);
const ventaSeleccionada = ref(null);

async function listarVentas() {
  console.log(localStorage.getItem("pruebas"));
  try {
    let r = await getData("ventas/lista_ventas");
    console.log('Respuesta ventas:', r);
    rowsVentas.value = r.buscar || r.ventas || r;
  } catch (error) {
    console.log("err " + error);
  }
}

onBeforeMount(() => {
  listarVentas();
});

const columns = ref([
  {
    name: "fecha",
    label: "Fecha",
    align: "center",
    field: "fecha",
    sortable: true,
  },
  {
    name: "cliente",
    label: "Cliente",
    align: "left",
    field: "cliente",
  },
  {
    name: "productos", 
    label: "Productos",
    align: "left",
    field: "producto",
  },
  {
    name: "total",
    label: "Total",
    align: "right", 
    field: "precioTotal",
    sortable: true,
  },
  {
    name: "options",
    label: "Opciones",
    align: "center",
  },
]);

function formatearFecha(fecha) {
  if (!fecha) return 'N/A';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

function verDetalle(venta) {
  console.log('Ver detalle:', venta);
  ventaSeleccionada.value = venta;
  showModal.value = true;
}

function cerrarModal() {
  showModal.value = false;
  ventaSeleccionada.value = null;
}

// Función para obtener detalle específico (opcional)
async function obtenerDetalleVenta(id) {
  try {
    let r = await getData(`ventas/listar_venta_especifica/${id}`);
    console.log('Detalle venta:', r);
    return r.buscar || r.venta || r;
  } catch (error) {
    console.log("err " + error);
    return null;
  }
}
</script>

<style lang="sass">
.my-sticky-header-table
  height: auto
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    background-color: #00b4ff
    color: white
  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
  &.q-table--loading thead tr:last-child th
    top: 48px
  tbody
    scroll-margin-top: 48px
</style>