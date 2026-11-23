import React from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { readCarSaleDraft } from '../Forms/CarSaleDraftStorage';
import { readMarriageDraft } from '../Forms/MarriageDraftStorage';
import { readMutualDraft } from '../Forms/MutualDraftStorage';
import { formatDateTime } from '../Functions/DateFormat';
import { prepareHistoryDraft } from '../History/HistoryDraftNavigation';
import { presentDocumentHistory } from '../History/DocumentHistoryPresentation';
import Header from './Header';
import FeaturedPost from './FeaturedPost';

const featuredPosts = [
  {
    title: 'Compra venta de vehículos',
    description:
      'Contrato de compra venta de vehículo con sección de autenticación notarial para El Salvador.',
    meta: 'Formulario guiado / Word y PDF',
    to: '/compra-venta',
  },
  {
    title: 'Mutuo',
    description:
      'Contrato de mutuo simple entre acreedor y deudor, con auténtica notarial y condiciones configurables.',
    meta: 'Formulario guiado / Word y PDF',
    to: '/mutuo',
  },
  {
    title: 'Matrimonio',
    description:
      'Expediente prematrimonial, escritura matriz y control registral.',
    meta: 'Formulario guiado / Word y PDF',
    to: '/matrimonio',
  },
];

const quickLinks = [
  {
    title: 'Historial de documentos',
    description: 'Consulte, descargue o retome documentos anteriores.',
    to: '/historial',
  },
  {
    title: 'Datos y configuración',
    description:
      'Administre personas, vehículos, profesionales, colaboradores y plantillas.',
    to: '/configuracion',
  },
];

const draftTypes = [
  {
    label: 'Compra venta de vehículos',
    read: readCarSaleDraft,
    route: '/compra-venta',
  },
  { label: 'Mutuo', read: readMutualDraft, route: '/mutuo' },
  { label: 'Matrimonio', read: readMarriageDraft, route: '/matrimonio' },
];

export const listSavedDrafts = (storage) =>
  draftTypes
    .map((type) => ({ ...type, draft: type.read(storage) }))
    .filter(({ draft }) => draft)
    .sort((left, right) =>
      right.draft.savedAt.localeCompare(left.draft.savedAt)
    );

export const backupNeedsAttention = (lastBackupAt, now = Date.now()) => {
  const backupTime = new Date(lastBackupAt).getTime();
  return (
    !lastBackupAt ||
    Number.isNaN(backupTime) ||
    now - backupTime > 30 * 24 * 60 * 60 * 1000
  );
};

export default function Blog({ historyProps, lastBackupAt, loadDraft }) {
  const navigate = useNavigate();
  const savedDrafts = listSavedDrafts(window.localStorage);
  const recentDocuments = historyProps.data.slice(0, 5);
  const reuseDocument = (historyItem) => {
    navigate(prepareHistoryDraft(historyItem, window.localStorage, loadDraft));
  };

  return (
    <>
      <Header title="Xpeditze" />
      <Box
        component="main"
        sx={{
          bgcolor: 'background.default',
          minHeight: 'calc(100vh - 76px)',
          py: { xs: 3, md: 5 },
        }}
      >
        <Container maxWidth="lg">
          <Box id="documentos" sx={{ mb: 3, scrollMarginTop: 96 }}>
            <Typography
              color="primary.main"
              fontWeight={700}
              variant="overline"
            >
              Espacio de trabajo
            </Typography>
            <Typography component="h1" variant="h4">
              ¿Qué necesita hacer?
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.75 }}>
              Cree un documento nuevo o continúe con información guardada.
            </Typography>
          </Box>

          {historyProps.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {historyProps.error}
            </Alert>
          )}

          {backupNeedsAttention(lastBackupAt) && (
            <Alert
              action={
                <Button
                  color="inherit"
                  component={RouterLink}
                  size="small"
                  to="/configuracion"
                >
                  Respaldar
                </Button>
              }
              severity="warning"
              sx={{ mb: 2 }}
            >
              {lastBackupAt
                ? `El último respaldo registrado fue ${formatDateTime(lastBackupAt)}.`
                : 'Aún no hay un respaldo registrado en este equipo.'}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
            <Grid
              size={{
                xs: 12,
                md: 8,
              }}
            >
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  height: '100%',
                  p: { xs: 2, md: 3 },
                }}
              >
                <Typography component="h2" variant="h6" sx={{ mb: 0.5 }}>
                  Crear documento
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                  sx={{ mb: 2 }}
                >
                  Seleccione uno de los documentos disponibles.
                </Typography>
                <Grid container>
                  {featuredPosts.map((post) => (
                    <FeaturedPost key={post.title} post={post} />
                  ))}
                </Grid>
              </Box>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  height: '100%',
                  p: { xs: 2, md: 3 },
                }}
              >
                <Typography component="h2" variant="h6" sx={{ mb: 1.5 }}>
                  Accesos rápidos
                </Typography>
                {quickLinks.map((link) => (
                  <ButtonBase
                    component={RouterLink}
                    key={link.to}
                    to={link.to}
                    sx={{
                      borderTop: '1px solid',
                      borderColor: 'divider',
                      display: 'block',
                      py: 1.75,
                      textAlign: 'left',
                      width: '100%',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    <Typography fontWeight={650}>{link.title}</Typography>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      sx={{ mt: 0.4 }}
                    >
                      {link.description}
                    </Typography>
                  </ButtonBase>
                ))}
              </Box>
            </Grid>
          </Grid>

          {(savedDrafts.length > 0 || recentDocuments.length > 0) && (
            <Grid container spacing={2} sx={{ mt: 0 }}>
              {savedDrafts.length > 0 && (
                <Grid size={{ xs: 12, md: 5 }}>
                  <Box
                    sx={{
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      height: '100%',
                      p: { xs: 2, md: 2.5 },
                    }}
                  >
                    <Typography component="h2" variant="h6">
                      Continuar borrador
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Retome el trabajo guardado automáticamente.
                    </Typography>
                    <Stack sx={{ mt: 1.5 }}>
                      {savedDrafts.map(({ draft, label, route }) => (
                        <ButtonBase
                          component={RouterLink}
                          key={route}
                          to={route}
                          sx={{
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            display: 'block',
                            py: 1.25,
                            textAlign: 'left',
                            width: '100%',
                          }}
                        >
                          <Typography fontWeight={650} variant="body2">
                            {label}
                          </Typography>
                          <Typography color="text.secondary" variant="caption">
                            Guardado {formatDateTime(draft.savedAt)}
                          </Typography>
                        </ButtonBase>
                      ))}
                    </Stack>
                  </Box>
                </Grid>
              )}

              {recentDocuments.length > 0 && (
                <Grid size={{ xs: 12, md: savedDrafts.length ? 7 : 12 }}>
                  <Box
                    sx={{
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      height: '100%',
                      p: { xs: 2, md: 2.5 },
                    }}
                  >
                    <Typography component="h2" variant="h6">
                      Documentos recientes
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Descargue un archivo o reutilice sus datos.
                    </Typography>
                    <Stack sx={{ mt: 1.5 }}>
                      {recentDocuments.map((historyItem) => {
                        const presentation =
                          presentDocumentHistory(historyItem);
                        return (
                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            key={historyItem.id}
                            spacing={1}
                            sx={{
                              alignItems: { sm: 'center' },
                              borderTop: '1px solid',
                              borderColor: 'divider',
                              justifyContent: 'space-between',
                              py: 1.1,
                            }}
                          >
                            <Box sx={{ minWidth: 0 }}>
                              <Typography fontWeight={650} variant="body2">
                                {presentation.title}
                              </Typography>
                              <Typography
                                color="text.secondary"
                                variant="caption"
                              >
                                {formatDateTime(historyItem.createdAt)}
                              </Typography>
                            </Box>
                            <Stack direction="row" spacing={0.5}>
                              <Button
                                disabled={
                                  !Object.keys(historyItem.draft || {}).length
                                }
                                onClick={() => reuseDocument(historyItem)}
                                size="small"
                                variant="outlined"
                              >
                                Usar como base
                              </Button>
                              <Button
                                onClick={() =>
                                  historyProps.download(historyItem, 'docx')
                                }
                                size="small"
                              >
                                Word
                              </Button>
                              <Button
                                onClick={() =>
                                  historyProps.download(historyItem, 'pdf')
                                }
                                size="small"
                              >
                                PDF
                              </Button>
                            </Stack>
                          </Stack>
                        );
                      })}
                    </Stack>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
}

Blog.propTypes = {
  historyProps: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    download: PropTypes.func.isRequired,
    error: PropTypes.string,
  }).isRequired,
  lastBackupAt: PropTypes.string,
  loadDraft: PropTypes.func.isRequired,
};
