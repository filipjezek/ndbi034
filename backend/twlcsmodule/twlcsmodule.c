#define PY_SSIZE_T_CLEAN
#define NPY_NO_DEPRECATED_API NPY_1_7_API_VERSION
#include <Python.h>
#include <numpy/arrayobject.h>

static int i_max(int a, int b) {
  return a > b ? a : b;
}
static int i_max_3(int a, int b, int c) {
  return a > b ? i_max(a, c) : i_max(b, c);
}

static PyObject* twlcs(PyObject* self, PyObject* args) {
  PyObject* arg1 = NULL, * arg2 = NULL;
  PyArrayObject* track1 = NULL, * track2 = NULL;
  npy_intp a, b;

  if (!PyArg_ParseTuple(args, "OO", &arg1, &arg2)) {
    return NULL;
  }
  track1 = (PyArrayObject*)PyArray_FROM_OTF(arg1, NPY_INT, NPY_ARRAY_IN_ARRAY);
  if (track1 == NULL) { return NULL; }
  track2 = (PyArrayObject*)PyArray_FROM_OTF(arg2, NPY_INT, NPY_ARRAY_IN_ARRAY);
  if (track1 == NULL) { goto fail; }

  a = PyArray_SIZE(track1);
  b = PyArray_SIZE(track2);
  int* matrix = calloc((a + 1) * (b + 1), sizeof(int));
  npy_int* a_item, * b_item;

  for (int i = 1; i <= a; i++) {
    for (int j = 1; j <= b; j++) {
      a_item = PyArray_GETPTR1(track1, i - 1);
      b_item = PyArray_GETPTR1(track2, j - 1);
      if (*a_item == *b_item) {
        matrix[i * b + j] = i_max_3(matrix[(i - 1) * b + j], matrix[i * b + j - 1], matrix[(i - 1) * b + j - 1]) + 1;
      }
      else {
        matrix[i * b + j] = i_max(matrix[(i - 1) * b + j], matrix[i * b + j - 1]);
      }
    }
  }

  int res = matrix[a * b - 1];
  free(matrix);
  Py_DECREF(track1);
  Py_DECREF(track2);
  return PyLong_FromLong(res);

fail:
  Py_XDECREF(track1);
  Py_XDECREF(track2);
  return NULL;
}

static PyMethodDef twlcs_methods[] = {
    { "twlcs", twlcs, METH_VARARGS,
      "Compute the Time-Warped Longest Common Subsequence of two tracks"
    },
    {NULL, NULL, 0, NULL} /* Sentinel */
};

static struct PyModuleDef twlcs_module = {
    PyModuleDef_HEAD_INIT,
    "twlcs",   /* name of module */
    NULL,
    -1,       /* size of per-interpreter state of the module,
                 or -1 if the module keeps state in global variables. */
    twlcs_methods
};

PyMODINIT_FUNC
PyInit_twlcs(void)
{
  import_array();
  return PyModule_Create(&twlcs_module);
}