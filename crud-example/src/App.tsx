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

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = React.useState<Props>({ open: false, type: PropsTypes.NONE, user: null });
  const [snackbar, setSnackbar] = React.useState({ isOpen: false, message: '' });
  const [formUser, setFormUser] = useState<User>({
    id: 0,
    code: '',
    name: '',
    description: '',
  });

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
    
  }

  function clearDialog() {
    setDialog({ open: false, type: dialog.type, user: null });
  }

  function handleUpdate(formUser: User | null) {
    
  };

  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ isOpen: false, message: '' });
  };

  function handleAdd(formUser: User) {
    
  }



  if (error) {
    return (
      <Container maxWidth="xl">
        <h1>Página no cargada</h1>
      </Container>
    );
  }

  return (
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
            {loading ? <TableBody>
              <TableRow key='0'>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
              </TableRow>
              <TableRow key='1'>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
              </TableRow>
              <TableRow key='2'>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
              </TableRow>
            </TableBody> :
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
                        aria-label="delete"
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
            }
          </Table>
        </TableContainer>

        <Dialog open={dialog.open} onClose={() => handleUpdate(null)}>
          <DialogTitle>{dialog.type}</DialogTitle>
          <DialogContent>
            <TextField sx={{ my: 1 }}
              required
              id="code-input"
              label="Código"
              fullWidth
              error={formUser.code.length > 5 || formUser.code.length < 1}
              helperText={formUser.code.length < 1 ?
                'Campo requerido' : formUser.code.length > 5 ?
                  'El código no puede ser mayor a 5 caracteres' : null}
              defaultValue={formUser.code}
              onChange={(event) => {
                const newValue = event.target.value;
                setFormUser((prevForm) => ({
                  ...prevForm, code: newValue
                }));
              }}
            />
            <TextField sx={{ my: 1 }}
              required
              id="name-input"
              label="Nombre"
              fullWidth
              error={formUser.name.length < 1}
              helperText={formUser.name.length < 1 ?
                'Campo requerido' : null}
              defaultValue={formUser.name}
              onChange={(event) => {
                const newValue = event.target.value;
                setFormUser((prevForm) => ({
                  ...prevForm, name: newValue
                }));
              }}
            />
            <TextField sx={{ my: 1 }}
              required
              id="description-input"
              label="Descripción"
              fullWidth
              error={formUser.description.length < 1}
              helperText={formUser.description.length < 1 ?
                'Campo requerido' : null}
              defaultValue={formUser.description}
              onChange={(event) => {
                const newValue = event.target.value;
                setFormUser((prevForm) => ({
                  ...prevForm, description: newValue
                }));
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
}
