<template>
  <div class="q-pa-md">
    <q-table
      class="my-sticky-header-table"
      flat
      bordered
      title="Gestión de Clientes"
      :rows="rowsClientes"
      :columns="columns"
      row-key="_id"
    >
      <template v-slot:body-cell-telefono="props">
        <q-td :props="props">
          <q-chip 
            color="info" 
            text-color="white"
            :label="props.row.telefono"
            icon="phone"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-correo="props">
        <q-td :props="props">
          <div class="text-primary">
            {{ props.row.correo }}
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
            icon="edit"
            size="sm"
            @click="editar(props.row)"
          />
          
          <q-btn 
            flat 
            round 
            dense 
            color="negative" 
            icon="delete"
            size="sm"
            @click="eliminar(props.row._id)"
          />
        </q-td>
      </template>
    </q-table>

    <!-- Modal editar -->
    <q-dialog v-model="showModal">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Editar Cliente</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="form.nombre" label="Nombre" />
          <q-input v-model="form.documento" label="Documento" />
          <q-input v-model="form.dirección" label="Dirección" />
          <q-input v-model="form.correo" label="Correo" type="email" />
          <q-input v-model.number="form.telefono" label="Teléfono" type="number" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="cerrarModal" />
          <q-btn flat label="Guardar" color="primary" @click="guardarCliente" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { getData, postData, putData } from "../services/apiClient.js";

const rowsClientes = ref([]);
const showModal = ref(false);
const clienteEditando = ref(null);
const form = ref({
  nombre: '',
  documento: '',
  dirección: '',
  correo: '',
  telefono: 0
});

async function listarClientes() {
  console.log(localStorage.getItem("pruebas"));
  let r = await getData("clientes/listar_cliente");
  console.log(r);
  rowsClientes.value = r.buscar || r.clientes || r;
}

onBeforeMount(() => {
  listarClientes();
});

const columns = ref([
  {
    name: "nombre",
    label: "Nombre",
    align: "left",
    field: (row) => row.nombre,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "documento",
    label: "Documento",
    align: "center",
    field: "documento",
    sortable: true,
  },
  { name: "direccion", label: "Dirección", field: "dirección", sortable: true },
  { name: "correo", label: "Correo", field: "correo" },
  { name: "telefono", label: "Teléfono", field: "telefono" },
  { name: "options", label: "Opciones" },
]);

function editar(cliente) {
  console.log('Editando:', cliente);
  clienteEditando.value = cliente;
  form.value = {
    nombre: cliente.nombre || '',
    documento: cliente.documento || '',
    dirección: cliente.dirección || '',
    correo: cliente.correo || '',
    telefono: cliente.telefono || 0
  };
  showModal.value = true;
}

function cerrarModal() {
  showModal.value = false;
  clienteEditando.value = null;
}

async function guardarCliente() {
  console.log('Guardando:', form.value);
  
  try {
    let r = await putData(`clientes/modificar/${clienteEditando.value._id}`, {
      nombre: form.value.nombre,
      documento: form.value.documento,
      direccion: form.value.dirección,  // Backend espera sin tilde en req.body
      correo: form.value.correo,
      telefono: Number(form.value.telefono)
    });
    console.log('Respuesta:', r);
    cerrarModal();
    listarClientes();
  } catch (error) {
    console.log("err " + error);
  }
}

async function eliminar(id) {
  console.log('Eliminando:', id);
  
  if (confirm('¿Está seguro de eliminar este cliente?')) {
    try {
      let r = await putData(`clientes/eliminar/${id}`);
      console.log('Respuesta:', r);
      listarClientes();
    } catch (error) {
      console.log("err " + error);
    }
  }
}
</script>

<style lang="sass">
.my-sticky-header-table
  height: 410px
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