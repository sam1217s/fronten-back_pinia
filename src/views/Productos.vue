<template>
  <div class="q-pa-md">
    <q-table class="my-sticky-header-table" flat bordered title="Gestión de Productos" :rows="rowsProductos"
      :columns="columns" row-key="_id">
      <template v-slot:top-right>
        <q-btn color="primary" icon="add" label="Nuevo Producto" @click="nuevoProducto()" />
      </template>

      <template v-slot:body-cell-precio="props">
        <q-td :props="props">
          <div class="text-weight-bold text-positive">
            ${{ Number(props.row.precio).toLocaleString() }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-stock="props">
        <q-td :props="props">
          <q-chip :color="props.row.stock > 10 ? 'positive' : 'orange'" text-color="white" :label="props.row.stock" />
        </q-td>
      </template>

      <template v-slot:body-cell-estado="props">
        <q-td :props="props">
          <div v-if="getEstado(props.row)">
            <q-badge color="green">Activo</q-badge>
          </div>
          <div v-else>
            <q-badge color="red">Inactivo</q-badge>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-options="props">
        <q-td :props="props" class="text-center">
          <div class="row no-wrap q-gutter-xs justify-center">
            <q-btn flat round dense color="primary" icon="edit" size="sm" @click="editar(props.row)" />

            <q-btn v-if="getEstado(props.row)" flat round dense color="negative" icon="toggle_off" size="sm"
              @click="desactivar(props.row._id)" />

            <q-btn v-else flat round dense color="positive" icon="toggle_on" size="sm"
              @click="activar(props.row._id)" />
          </div>
        </q-td>
      </template>
    </q-table>

   <!-- Modal editar/crear -->
    <q-dialog v-model="showModal">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ productoEditando ? 'Editar Producto' : 'Nuevo Producto' }}</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-form ref="formularioProducto">
            <q-input v-model="form.nombre" label="Nombre" :rules="[
              val => (val && val.length > 0) || 'Nombre Requerido',
              val => (val && val.length >= 6) || 'Mínimo 6 caracteres',
              val => (val && val.length <= 50) || 'Máximo 50 caracteres'
            ]" />

            <q-select v-model="form.categoría" :options="categorias" label="Categoría" behavior="menu" :rules="[
              val => (val && val.length > 0) || 'Categoría Requerida'
            ]" />

            <q-input v-model.number="form.precio" type="number" label="Precio" :rules="[
              val => val || 'Precio Requerido',
              val => val > 0 || 'Debe ser mayor a 0'
            ]" />

            <q-input v-model.number="form.stock" type="number" label="Stock" :rules="[
              val => val || 'Stock Requerido',
              val => val > 0 || 'Mínimo 1 producto requerido'
            ]" />

            <q-input v-model="form.descripcion" label="Descripción" type="textarea" rows="3" />
          </q-form>
        </q-card-section>

       <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="cerrarModal" />
          <q-btn 
            flat 
            label="Guardar" 
            color="primary" 
            @click="guardarProducto"
            :loading="guardando"
            :disable="guardando"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { getData, postData, putData } from "../services/apiClient.js";
import { useNotifications } from "../composables/useNotifications.js";
// aca se guarda el estado de carga del boton guardar
const guardando = ref(false)

const { success, error, warning, info } = useNotifications();
const rowsProductos = ref([]);
const showModal = ref(false);
const productoEditando = ref(null);
const form = ref({
  nombre: '',
  categoría: '',
  precio: 0,
  stock: 0,
  descripcion: ''
});

const categorias = ref([
  'Alimentos y Bebidas',
  'Tecnología y Electrónicos',
  'Ropa y Moda',
  'Salud y Belleza',
  'Hogar y Muebles',
  'Deportes y Recreación',
  'Automóviles y Motocicletas',
  'Libros y Educación',
  'Arte y Manualidades',
  'Servicios'
]);

async function listarProductos() {
  console.log(localStorage.getItem("pruebas"));
  let r = await getData("productos/listar_producto");
  console.log(r);

  const productos = r.buscar || r.productos || r;

  // Ordenar por _id (los más nuevos tienen IDs más recientes)
  productos.sort((a, b) => b._id.localeCompare(a._id));
  rowsProductos.value = productos;
}

onBeforeMount(() => {
  listarProductos();
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
    name: "precio",
    align: "center",
    label: "Precio",
    field: "precio",
    sortable: true,
  },
  { name: "categoria", label: "Categoria", field: "categoría", sortable: true },
  { name: "descripcion", label: "Descripcion", field: "descripcion" },
  { name: "stock", label: "Stock", field: "stock" },
  { name: "estado", label: "Estado", field: "estado" },
  { name: "options", label: "Opciones", align: "center" },
]);

function getEstado(producto) {
  console.log('Verificando estado del producto:', producto.nombre, producto);

  // Verificar diferentes posibles campos de estado
  if (producto.estado !== undefined) {
    const estado = producto.estado === true || producto.estado === 1 || producto.estado === "activo";
    console.log('Estado por campo "estado":', estado);
    return estado;
  }

  if (producto.activo !== undefined) {
    const estado = producto.activo === true || producto.activo === 1;
    console.log('Estado por campo "activo":', estado);
    return estado;
  }

  // Por defecto, considerar activo si no hay campo de estado
  console.log('Estado por defecto: activo');
  return true;
}

function nuevoProducto() {
  console.log('Creando nuevo producto');
  productoEditando.value = null;
  form.value = {
    nombre: '',
    categoría: '',
    precio: 0,
    stock: 0,
    descripcion: ''
  };
  showModal.value = true;
}

function editar(producto) {
  console.log('Editando:', producto);
  productoEditando.value = producto;
  form.value = {
    nombre: producto.nombre || '',
    categoría: producto.categoría || 'Servicios',
    precio: producto.precio || 0,
    stock: producto.stock || 0,
    descripcion: producto.descripcion || ''
  };
  showModal.value = true;

}

function cerrarModal() {
  showModal.value = false;
  productoEditando.value = null;
}

async function guardarProducto() {
  console.log('Guardando:', form.value);
guardando.value = true; // Activar estado de carga del botón
  try {
    const datosProducto = {
      nombre: form.value.nombre,
      categoría: form.value.categoría,
      precio: Number(form.value.precio),
      stock: Number(form.value.stock),
      descripcion: form.value.descripcion || 'sin descripcion'
    };

    let r;
    if (productoEditando.value) {
      // Editar producto existente
      r = await putData(`productos/modificar_producto/${productoEditando.value._id}`, datosProducto);
    } else {
      // Crear nuevo producto
      r = await postData('productos/guardar_producto', datosProducto);
    }

    console.log('Respuesta:', r);
    // Notificación de éxito
    success('Producto guardado', 'El producto se guardó correctamente');
    cerrarModal();
    listarProductos();
  } catch (error) {
    console.log("err " + error);
    // Notificación de error
    error('Error al guardar', 'No se pudo guardar el producto');
  } finally {
    guardando.value = false; // Resetear estado de carga del botón
  }
}

async function activar(id) {
  console.log(id);
  try {
    let r = await putData(`productos/activarProducto/${id}`);
    console.log(r);
    // Notificación de éxito
    success('Producto activado', 'El producto se activó correctamente');
    listarProductos();
  } catch (error) {
    console.log("err " + error);
    // Notificación de error
    error('Error al activar', 'No se pudo activar el producto');
  }
}

async function desactivar(id) {
  console.log(id);
  try {
    let r = await putData(`productos/desactivarProducto/${id}`);
    console.log(r);
    // Notificación de éxito
    warning('Producto desactivado', 'El producto se desactivó correctamente');
    listarProductos();
  } catch (error) {
    console.log("err " + error);
    // Notificación de error
    error('Error al desactivar', 'No se pudo desactivar el producto');
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
