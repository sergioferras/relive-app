import { useState, useEffect } from "react";
import moment from 'moment'
import { withCookies } from 'react-cookie';
import axios from "axios";
import { withStyles } from '@material-ui/core/styles';
/* import Chip from '@material-ui/core/Chip'; */
import Button from '@material-ui/core/Button'
/* import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar'; */
import Container from '@material-ui/core/Container';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

/* import Link from "next/link"; */
import Head from "next/head";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
/* import Error from "./_error"; */

/* import PublicIcon from '@material-ui/icons/Public'
import CreateIcon from '@material-ui/icons/Create' */

const csrfState = Math.random().toString(36).substring(7);

/* STATUS CODES OF ADVERTS:

pending         // POST
pending_update  // PUT
pending_activate
pending_deactivate
pending_delete  // DELETE

SE CONTER pending DIZER E BLOQUEAR AÇOES

active
unpaid
removed_by_user
outdated_by_package
moderated
removed_by_moderator
outdated

any error

*/

const advertCode = (code) => {
    switch (code) {
        case 'active':
            return <span style={{ color: 'green' }}>Anúncio público</span>
        case 'unpaid':
            return <span style={{ color: 'crimson', fontWeight: 500 }}>Anúncio não público, falta de slots ou Package</span>
        case 'removed_by_user':
            return <span style={{ color: 'blue' }}>Anúncio removido por utilizador</span>
        case 'outdated_by_package':
            return <span style={{ color: 'crimson', fontWeight: 500 }}>Package expirado, será publicado automaticamente ao ativar Imovirtual</span>
        case undefined:
            return <span style={{ color: 'crimson' }}>Erro</span>
        default: /* moderated
        removed_by_moderator
        outdated */
            return <span style={{ color: 'blue' }}>{'Anuncio sofreu alteração ' + code + ': não está Público'}</span>
    }
}

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const Profile = (props) => {
    const [notifications, setNotifications] = useState([]);
    const [authLink, setAuthLink] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { cookies } = props
        cookies.set('csrfState', csrfState, { path: '/' })

        axios.get("/imovirtual/oauth")
            .then(res => {
                setAuthLink(res.data)
            })
            .catch(err => {
                console.log(err)
            })
        
        axios.get("/imovirtual/notifications")
            .then(res => {
                const nots = res.data.notifications.reverse() /* Latest First */
                setNotifications(nots)
                
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
            })
    }, []);

    const getTax = () => {
        axios.get(`/imovirtual/taxonomy`)
            .then(res => {
                console.log(res)
            })
            .catch(err => console.log(err))
    }


    const getDir = () => {
        axios.get(`/idealista/directory`)
            .then(res => {
                console.log(res)
            })
            .catch(err => console.log(err))
    }
    const getDown = () => {
        axios.get(`/idealista/download`)
            .then(res => {
                console.log(res)
            })
            .catch(err => console.log(err))
    }
    const getUp = () => {
        axios.get(`/idealista/upload`)
            .then(res => {
                console.log(res)
            })
            .catch(err => console.log(err))
    }

    if (loading)
        return <Loading message="A carregar profile" />;
    return (
        <Layout
            mainTitle="Propriedades Relive"
            footer={`Relive Copyright ${new Date().getFullYear()} | All rights reserved`}
            signedIn={props.signedIn}
        >
            <Head>
                <title>Profile Imovirtual</title>
            </Head>
            <Container maxWidth="lg" className="container">
                {/* <h2>Número total de notificações: {notifications.length}</h2> */}
                {authLink &&
                    <Button variant="contained" /* disabled={authLink.status}  */ color="primary" href={authLink.url + csrfState}>
                        {/* ///////////  MUDA DEPENDENDO DO STATUS DA CONECTION COM IMOVIRTUAL (ver se tem tokens?) */}
                        {/*  {authLink.status ? 'Imovirtual já autenticado' : 'Autenticar conta do Imovirtual'} */}
                        Autenticar conta do Imovirtual
                    </Button>
                }

                <Button variant="contained" color="primary" onClick={() => getTax()}>
                    Get Taxonomy
                </Button>

                {/* <Button variant="contained" color="primary" onClick={() => getDir()}>
                    FTP DIR
                </Button>
                <Button variant="contained" color="primary" onClick={() => getDown()}>
                    FTP Down
                </Button>
                <Button variant="contained" color="primary" onClick={() => getUp()}>
                    FTP UP
                </Button> */}

                {/* <Button variant="contained" color="primary" onClick={() => getIdeStats()}>
                    Download Idealista Stats
                </Button> */}


                <h3>Verifica se já possuis a nossa app <a target="_blank" href="https://www.imovirtual.com/contapessoal/definicoes-de-conta/#aplicacoes">aqui</a>, se visualizar a app Relive, revoga e clica em "Autenticar conta do Imovirtual"</h3>

                <h1>Notificações</h1>
                <TableContainer component={Paper}>
                    <Table className="tabela" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Plataforma</StyledTableCell>
                                <StyledTableCell align="left">Flow</StyledTableCell>
                                <StyledTableCell align="left">Tipo</StyledTableCell>
                                <StyledTableCell align="left">Status Actual</StyledTableCell>
                                <StyledTableCell align="left">Imovel</StyledTableCell>
                                <StyledTableCell align="left">Detalhe</StyledTableCell>
                                <StyledTableCell align="left">Data Alteração</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {notifications.map((row, i) => (
                                <StyledTableRow key={i}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.provider}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">{row.flow}</StyledTableCell>
                                    <StyledTableCell align="left"><span style={{ color: row.event_type.includes('error') ? "red" : "inherit" }}>{row.event_type}</span></StyledTableCell>
                                    <StyledTableCell align="left">{row.data && row.data.code ? advertCode(row.data.code) : null}</StyledTableCell>
                                    <StyledTableCell align="left">{row.website_id ? <Button color="primary" href={`/imovel/${row.website_id}`}>RE-{row.website_id}</Button> : null}</StyledTableCell>
                                    <StyledTableCell align="left">{row.data && row.data.validation ? row.data.validation[0].detail : (row.data && row.data.moderation ? row.data.moderation.reason : row.data && row.data.id ? <Button color="primary" target="_blank" href={`https://www.imovirtual.com/contapessoal/responder/${row.data.id}`}>{row.data.sender_email}</Button> : null)}</StyledTableCell>
                                    <StyledTableCell align="left">{row.data ? (row.data.recorded_at ? moment(row.data.recorded_at).format('lll') : moment.unix(parseInt(row.timestamp) / 1000).format("lll")) : null}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Layout>
    );
};

export default withCookies(Profile);
