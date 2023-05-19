import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Alert, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Skeleton, Snackbar, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { clear } from 'console';

enum PropsTypes {
  ADD = 'Agregar',
  EDIT = 'Editar',
  NONE = 'None',
}

interface User {
  id: number,
  code: string,
  name: string,
  description: string,
}

interface Props {
  open: boolean,
  type: PropsTypes,
  user: User | null,
}

interface FormErrors {
  code: boolean,
  name: boolean,
  description: boolean,
}

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [formError, setFormError] = useState<FormErrors>({ code: false, name: false, description: false });
  const [nonFilteredUsers, setNonFilteredUsers] = useState<User[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = React.useState<Props>({ open: false, type: PropsTypes.NONE, user: null });
  const [snackbar, setSnackbar] = React.useState({ isOpen: false, message: '' });
  const [formUser, setFormUser] = useState<User>({
    id: 0,
    code: '',
    name: '',
    description: '',
  });

  const baseUrl = 'http://20.231.202.18:8000/api/form';
  const fetchData = () => {
    axios.get(baseUrl)
      .then(response => {
        setUsers(response.data);
        setLoading(false);
        setNonFilteredUsers(response.data);
      })
      .catch(error => {
        setLoading(false);
        setError(true);
      });
  };


  useEffect(() => {
    fetchData();
  }, []);

  function handleClickOpen(props: Props) {
    if (props.user === null) {
      props.user = {
        id: 0,
        code: '',
        name: '',
        description: '',
      };
    }
    setFormUser(props.user);
    setDialog(props);
  }

  function handleDelete(id: number) {
    axios.delete(baseUrl + '/' + id)
      .then(response => {
        setUsers(users.filter(user => user.id !== id));
        setNonFilteredUsers(nonFilteredUsers.filter(user => user.id !== id));
      })
      .catch(error => {
        setSnackbar({ isOpen: true, message: 'No fue posible eliminar el registro' })
      });
  }

  function clearDialog() {
    setDialog({ open: false, type: dialog.type, user: null });
    setFormError({ code: false, name: false, description: false });
  }

  function handleUpdate(formUser: User | null) {
    axios.put(baseUrl + '/' + formUser?.id, formUser)
      .then(response => {
        setUsers(nonFilteredUsers.map(user => user.id === formUser?.id ? formUser : user));
        setNonFilteredUsers(nonFilteredUsers.map(user => user.id === formUser?.id ? formUser : user));
        clearDialog();
      })
      .catch(error => {
        setSnackbar({ isOpen: true, message: error.response.data.message })
      })
  };

  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ isOpen: false, message: '' });
  };

  function handleAdd(formUser: User) {
    axios.post(baseUrl, formUser)
      .then(response => {
        clearDialog();
        fetchData();
      })
      .catch(error => {
        setSnackbar({ isOpen: true, message: error.response.data.message })
      });
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <h1>No fue posible cargar la página</h1>
      </Container>
    );
  }
  const view =
    (
      <>
        <Snackbar open={snackbar.isOpen} autoHideDuration={4000} onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
        <Container maxWidth='xl' disableGutters={true} sx={{ mt: 5 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            mb: 2,
          }}>
            <Typography variant="h5">Lista de usuarios</Typography>
            <TextField
              id="search-input"
              label="Búsqueda"
              placeholder='Ingresa algo'
              onChange={(event) => {
                const newValue = event.target.value;
                setUsers(nonFilteredUsers
                  .filter(user => user.code.includes(newValue) ||
                    user.name.includes(newValue) ||
                    user.description.includes(newValue)))
              }}
            >
            </TextField>
            <Button variant="contained" color="success" onClick={() => handleClickOpen({ open: true, type: PropsTypes.ADD, user: null })}>
              Agregar
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>{loading ? <Skeleton /> : 'Código'}</TableCell>
                  <TableCell>{loading ? <Skeleton /> : 'Nombre'}</TableCell>
                  <TableCell>{loading ? <Skeleton /> : 'Descripción'}</TableCell>
                  <TableCell>{loading ? <Skeleton /> : 'Acciones'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(user => (
                  <TableRow
                    key={user.id}
                  >
                    <TableCell>{user.code}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.description}</TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="delete"
                        size="medium"
                        onClick={() => handleDelete(user.id)}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        aria-label="edit"
                        size="medium"
                        onClick={() => handleClickOpen({
                          open: true,
                          type: PropsTypes.EDIT,
                          user: {
                            id: user.id,
                            code: user.code,
                            name: user.name,
                            description: user.description
                          }
                        })}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={dialog.open}>
            <DialogTitle>{dialog.type}</DialogTitle>
            <DialogContent>
              <TextField sx={{ my: 1 }}
                required
                id="code-input"
                label="Código"
                fullWidth
                error={formError.code}
                helperText={formUser.code.length < 1 ?
                  'Campo requerido' : formUser.code.length > 5 ?
                    'El código no puede ser mayor a 5 caracteres' : null}
                defaultValue={formUser.code}
                onChange={(event) => {
                  const newValue = event.target.value;
                  setFormUser((prevForm) => ({
                    ...prevForm, code: newValue
                  }));
                  if (newValue.length > 5 || newValue.length < 1) {
                    setFormError(prevError => ({
                      ...prevError, code: true
                    }))
                  }
                  else {
                    setFormError(prevError => ({
                      ...prevError, code: false
                    }))
                  }
                }}
              />
              <TextField sx={{ my: 1 }}
                required
                id="name-input"
                label="Nombre"
                fullWidth
                error={formError.name}
                helperText={formUser.name.length < 1 ?
                  'Campo requerido' : null}
                defaultValue={formUser.name}
                onChange={(event) => {
                  const newValue = event.target.value;
                  setFormUser((prevForm) => ({
                    ...prevForm, name: newValue
                  }));
                  if (newValue.length < 1) {
                    setFormError(prevError => ({
                      ...prevError, name: true
                    }))
                  }
                  else {
                    setFormError(prevError => ({
                      ...prevError, name: false
                    }))
                  }
                }}
              />
              <TextField sx={{ my: 1 }}
                required
                id="description-input"
                label="Descripción"
                fullWidth
                error={formError.description}
                helperText={formUser.description.length < 1 ?
                  'Campo requerido' : null}
                defaultValue={formUser.description}
                onChange={(event) => {
                  const newValue = event.target.value;
                  setFormUser((prevForm) => ({
                    ...prevForm, description: newValue
                  }));
                  if (newValue.length < 1) {
                    setFormError(prevError => ({
                      ...prevError, description: true
                    }))
                  }
                  else {
                    setFormError(prevError => ({
                      ...prevError, description: false
                    }))
                  }
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => clearDialog()} color="error">Cancelar</Button>
              <Button
                disabled={formUser.code.length > 5 ||
                  formUser.code.length < 1 ||
                  formUser.name.length < 1 ||
                  formUser.description.length < 1}
                onClick={() => (
                  dialog.type === PropsTypes.EDIT ?
                    handleUpdate(formUser) : dialog.type === PropsTypes.ADD ?
                      handleAdd(formUser) : null
                )} variant="contained" color="success">{dialog.type}</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </>
    );

  return view;
}
