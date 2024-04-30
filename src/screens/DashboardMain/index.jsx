import * as React from 'react';
import {useEffect, useState} from 'react';
import {Box, Paper, Typography, CircularProgress, Grid, useMediaQuery,LinearProgress, useTheme, Divider} from '@mui/material';
import ExamsStatusPie from '../../components/ExamsStatusPie';
import ExamsStatusBar from '../../components/ExamsStatusBar';

const DashboardMain = () => {
    const [countAbsent, setCountAbsent] = useState([]);
    const [countExamsRemaining, setCountExamsRemaining] = useState(0);
    const [countDoneExams, setCountDoneExams] = useState(0);
    const [countTotalAgendamentos, setCountTotalAgendamentos] = useState([]);
    const [countCotaPCD, setCountCotaPCD] = useState([0]);
    const [countCotaEscolaPublica, setCountCotaEscolaPublica] = useState([0]);
    const [diasDesdeInicio, setDiasDesdeInicio] = useState([0]);
    const [diasDeProcesso, setDiasDeProcesso] = useState([0]);
    const [loading, setLoading] = useState(true);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchCompletedForms = async () => {
            const response = await fetch('https://nodered.pdcloud.dev/totalForms/Pequi');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let data = await response.json();
                data = data.filter(user => user.exam !== null)
                console.log('forms completos:',data);
            return data;
        }

        const fetchExamsStatus = async () => {
            const response = await fetch('https://api-hml.pdcloud.dev/form/testData/a09d7656-f2a0-4b33-8c12-c8a4580e5e9d', {
            headers: {
                'API-KEY': "Rm9ybUFwaUZlaXRhUGVsb0plYW5QaWVycmVQYXJhYURlc2Vudm9sdmU=",
            }
            }); //Retorna as Provas que já aconteceram
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            let data = await response.json();
            console.log('Exams Status:',data);
            return data;
        };

        // Usa Promise.all para esperar ambas as funções
        Promise.all([fetchCompletedForms(), fetchExamsStatus()])
            .then(([completedForms, examsStatus]) => {
                setCountExamsRemaining(examsStatus.testsRemaining);
                setCountDoneExams(examsStatus.testsDone);
                setCountTotalAgendamentos(examsStatus.totalTests);
                setCountAbsent(examsStatus.totalTests - examsStatus.testsRemaining - examsStatus.testsDone);
                setCountCotaPCD(completedForms.filter(user => user.cota == 'Pcd').length);
                setCountCotaEscolaPublica(completedForms.filter(user => user.cota == 'EscolaPublica').length);
            })
            .catch((error) => {
                console.error('Erro ao buscar dados:', error);
            })
            .finally(() => {
                setLoading(false); // Atualiza o estado de loading independentemente do resultado
            });

            const calcularDiasDesdeInicio = () => {

                const ajustarParaFusoHorario = (data) => {
                    // Considera o fuso horário -3, adicionando 3 horas
                    const offset = data.getTimezoneOffset() / 60 + 3; // getTimezoneOffset() retorna a diferença em minutos entre UTC e o fuso local
                    data.setHours(data.getHours() + offset);
                    return data;
                };

                const inicio = ajustarParaFusoHorario(new Date('2024-04-15'));
                const agora = ajustarParaFusoHorario(new Date());
                const final = ajustarParaFusoHorario(new Date('2024-05-11')); 
                
                //Contagem até agora
                let diferencaMilissegundos = agora - inicio;
                let diferencaDias = diferencaMilissegundos / (1000 * 60 * 60 * 24);
                setDiasDesdeInicio(Math.floor(diferencaDias));

                //Contagem até o final
                diferencaMilissegundos = final - inicio;
                diferencaDias = diferencaMilissegundos / (1000 * 60 * 60 * 24);
                setDiasDeProcesso(Math.floor(diferencaDias));
            };

            calcularDiasDesdeInicio();
    }, []);

 

    const totalProvasAteAgora = countDoneExams + countAbsent;
    const percentualProvasFeitas = (countDoneExams / totalProvasAteAgora);

    const projecaoAtualProvasFeitas = Math.round(countTotalAgendamentos * percentualProvasFeitas);
    const inscricoesEsperadasAoFinal = (countTotalAgendamentos / diasDesdeInicio) * diasDeProcesso;
    const projecaoFuturaProvasFeitas = Math.round(inscricoesEsperadasAoFinal * percentualProvasFeitas);

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                width: '100vw',
            }}>
                <CircularProgress/>
            </Box> 
        )
    }
    
    return (
        <Box sx={{ 
            height: '100vh',
            backgroundColor: '#F5F5F5', 
            p: 3,
            overflowX: 'hidden',
        }}>
                <Typography fontSize={isSmallScreen ? 25 : 70} fontWeight={'bold'} textAlign={'center'}>Dashboard de Dados Internos</Typography>
                <Typography fontSize={isSmallScreen ? 20 : 60} fontWeight={'bold'} textAlign={'center'}>Pequi</Typography>

                <Divider sx={{my:1}}/>

                <Paper sx={{padding: 2, margin:'auto', backgroundColor: '#F5F5F5', width:isSmallScreen ? 300 : 500, my:5}}>
                    {diasDeProcesso-diasDesdeInicio < 0 ? 
                    <Typography fontSize={isSmallScreen ? 20 : 50} textAlign={'center'}>Processo Seletivo Encerrado</Typography>
                    :
                    <>
                        <Typography fontSize={isSmallScreen ? 20 : 50} textAlign={'center'}>Dias de Processo Seletivo</Typography> 
                        <LinearProgress variant="determinate" value={(diasDesdeInicio/diasDeProcesso)*100} sx={{width: '100%', margin: 'auto'}} />
                        <Typography fontSize={isSmallScreen ? 20 : 30} textAlign={'center'}>{diasDesdeInicio} de {diasDeProcesso} dias</Typography>
                    </>}
                </Paper>

                <Grid container spacing={2} sx={{margin: 'auto', paddingLeft: 0}}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xg={6} sx={{ p: 2}}>
                        <Typography fontSize={isSmallScreen ? 20 : 30} fontWeight={'bold'} textAlign={'center'} mb={1}>Agendamentos Totais por Categoria em Pizza</Typography>
                        <Typography fontSize={20} textAlign={'center'}>Gráfico de todos os agendamentos de provas até o momento por categorias.</Typography>
                        <ExamsStatusPie
                            nm1={'Provas Feitas'}
                            qtdLabel1={countDoneExams}
                            nm2={'Faltas'}
                            qtdLabel2={countAbsent}
                            nm3={'Provas Agendadas para Fazer'}
                            qtdLabel3={countExamsRemaining}
                            isSmallScreen={isSmallScreen}
                        />
                        <Typography fontSize={20} textAlign={'center'}>Total de Agendamentos: {countTotalAgendamentos}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xg={6} sx={{p: 2}}>
                    <Typography fontSize={isSmallScreen ? 20 : 30} fontWeight={'bold'} textAlign={'center'} mb={1}>Presença nas Provas</Typography>
                    <Typography fontSize={20} textAlign={'center'}>Gráfico de presença e ausência em provas.</Typography>
                        <ExamsStatusPie
                            nm1={'Provas Feitas'}
                            qtdLabel1={countDoneExams}
                            nm2={'Provas com ausência'}
                            qtdLabel2={countAbsent}
                            isSmallScreen={isSmallScreen}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xg={12} sx={{p: 2}}>
                        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2, maxWidth: 800, margin:'auto'}}>
                            <Typography fontSize={isSmallScreen ? 20 : 30} fontWeight={'bold'} textAlign={'center'} mb={3}>Estimativa Projetada de Provas</Typography>
                            <Typography fontSize={20} textAlign={'left'} mb={3}>Projeção do total de provas feitas ao final do processo seletivo. Ele tem a perspectiva de 2 cenários:</Typography>
                            <Typography fontSize={20} textAlign={'left'} mb={3}>
                            Cenário 1: Projeção se as inscrições acabassem hoje<br/>
                            Cenário 2: Projeção com estimativa das inscrições <br/>
                            </Typography>
                            <ExamsStatusBar
                            label2={'Atual'}
                            qtdLabel2={projecaoAtualProvasFeitas}
                            label1={'Projetada'}
                            qtdLabel1={projecaoFuturaProvasFeitas}
                            isSmallScreen={isSmallScreen}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xg={12} sx={{p: 2}}>
                        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2, maxWidth: 800, margin:'auto'}}>
                            <Typography fontSize={isSmallScreen ? 20 : 30} fontWeight={'bold'} textAlign={'center'} mb={3}>Estimativa de Candidatos por Vaga</Typography>
                            <Typography fontSize={20} textAlign={'left'} mb={3}>
                                Ampla Concorrência: {Math.round(projecaoAtualProvasFeitas/47)} : 1<br/>
                                Cota PCD: {Math.round(countCotaPCD/3)} : 1<br/>
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>   
        </Box>
    )
}

export default DashboardMain;