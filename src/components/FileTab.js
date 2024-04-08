import React, {useState, useEffect} from 'react';
import {Button, Modal, Backdrop, IconButton, TextField, CircularProgress, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import PaginationDiv from "./PaginationDiv";
import SynonymsComponent from "./SynonymsComponent";
import ScrollableText from "./ScrollableText";
import config from '../config/development';
const backendUrl = config.backendUrl;
const useStyles = makeStyles((theme) => ({
    modalContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(4),
        maxWidth: '90%', // Adjust the maximum width here
        width: '90%', // Adjust the width here
        maxHeight: '90%', // Adjust the maximum height here
        overflowY: 'auto', // Enable vertical scrolling if content exceeds height
        position: 'relative', // Set position to relative
    },
    closeButton: {
        position: 'absolute',
        top: theme.spacing(1),
        right: theme.spacing(1),
    },
    customBackdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    errorText: {
        color: 'red',
        marginTop: theme.spacing(2),
        textAlign: 'center',
    },
}));

const FileTab = ({file}) => {
    const classes = useStyles();
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [synonymsModalOpen, setSynonymsModalOpen] = useState(false);
    const [maskingModalOpen, setMaskingModalOpen] = useState(false);
    const [synonymsInput, setSynonymsInput] = useState('');
    const [maskingInput, setMaskingInput] = useState('');
    const [detailsData, setDetailsData] = useState(null);
    const [synonymsData, setSynonymsData] = useState(null);
    const [maskingData, setMaskingData] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [synonymsLoading, setSynonymsLoading] = useState(false);
    const [maskingLoading, setMaskingLoading] = useState(false);
    const [detailsError, setDetailsError] = useState('');
    const [synonymsError, setSynonymsError] = useState('');
    const [maskingError, setMaskingError] = useState('');

    useEffect(() => {
        if (detailsModalOpen) {
            setDetailsLoading(true);
            setDetailsError('');
            axios.get(`${backendUrl}/file-analytics/count/unique`, {
                params: {
                    fileCode: file.code
                }
            })
                .then(response => {
                    setDetailsData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching details data:', error);
                    setDetailsError('Failed to fetch details data');
                })
                .finally(() => {
                    setDetailsLoading(false); // Set loading to false after API call completes
                });
        }
    }, [detailsModalOpen]);

    const handleDetailsModalOpen = () => {
        setDetailsModalOpen(true);
    };

    const handleDetailsModalClose = () => {
        setDetailsModalOpen(false);
    };

    const handleSynonymsModalOpen = () => {
        setSynonymsModalOpen(true);
    };

    const handleSynonymsModalClose = () => {
        setSynonymsModalOpen(false);
    };

    const handleMaskingModalOpen = () => {
        setMaskingModalOpen(true);
    };

    const handleMaskingModalClose = () => {
        setMaskingModalOpen(false);
    };

    const handleSynonymsInputChange = (event) => {
        setSynonymsInput(event.target.value.split(",").map((word) => word.trim()));
    };

    const handleMaskingInputChange = (event) => {
        setMaskingInput(event.target.value.split(",").map((word) => word.trim()));
    };

    const handleSynonymsButtonClick = () => {
        setSynonymsLoading(true);
        setSynonymsError('');
        axios.post(`${backendUrl}/file-analytics/count/synonyms`, {
            fileCode: file.code,
            words: synonymsInput,
        })
            .then(response => {
                setSynonymsData(response.data);
            })
            .catch(error => {
                console.error('Error fetching synonyms:', error);
                setSynonymsError(error?.response?.data?.error);
            })
            .finally(() => {
                setSynonymsLoading(false); // Set loading to false after API call completes
            });
    };

    const handleMaskingButtonClick = () => {
        setMaskingLoading(true);
        setMaskingError('');
        axios.post(`${backendUrl}/file-analytics/mask/words`, {
            fileCode: file.code,
            words: maskingInput
        })
            .then(response => {
                setMaskingData(response.data);
            })
            .catch(error => {
                setMaskingError(error?.response?.data?.error);
                console.error('Error masking text:', error);
            })
            .finally(() => {
                setMaskingLoading(false); // Set loading to false after API call completes
            });
    };

    return (
        <div>
            <h3>{file.name}</h3>
            <p>Size: {file.size} bytes</p>
            <Button variant="contained" onClick={handleDetailsModalOpen}>View Details</Button>
            <span style={{ margin: '0 10px' }}></span>
            <Button variant="contained" onClick={handleSynonymsModalOpen}>Find Synonyms</Button>
            <span style={{ margin: '0 10px' }}></span>
            <Button variant="contained" onClick={handleMaskingModalOpen}>Mask Text</Button>

            {/* Details Modal */}
            <Modal
                open={detailsModalOpen}
                onClose={handleDetailsModalClose}
                aria-labelledby="details-modal-title"
                aria-describedby="details-modal-description"
                className={classes.modalContainer}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    classes: {
                        root: classes.customBackdrop,
                    },
                }}
            >
                <div className={classes.modalContent}>
                    <IconButton className={classes.closeButton} onClick={handleDetailsModalClose}>
                        <CloseIcon/>
                    </IconButton>
                    <h2 id="details-modal-title">File Details</h2>
                    <p id="details-modal-description">Name: {file.name}</p>
                    <p id="details-modal-description">Size: {file.size} bytes</p>
                    {detailsLoading && <div className={classes.loader}><CircularProgress/></div>}
                    {detailsError &&
                        <Typography variant="body1" className={classes.errorText}>{detailsError}</Typography>}
                    {detailsData && <PaginationDiv itemsPerPage={50} data={detailsData?.uniqueWordCount}/>}
                </div>
            </Modal>

            {/* Synonyms Modal */}
            <Modal
                open={synonymsModalOpen}
                onClose={handleSynonymsModalClose}
                aria-labelledby="synonyms-modal-title"
                aria-describedby="synonyms-modal-description"
                className={classes.modalContainer}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    classes: {
                        root: classes.customBackdrop,
                    },
                }}
            >
                <div className={classes.modalContent}>
                    <IconButton className={classes.closeButton} onClick={handleSynonymsModalClose}>
                        <CloseIcon/>
                    </IconButton>
                    <h2 id="synonyms-modal-title">Synonyms</h2>
                    <TextField
                        label="Enter words"
                        multiline
                        rows={4}
                        variant="outlined"
                        value={synonymsInput}
                        onChange={handleSynonymsInputChange}
                    />
                    <Button variant="contained" onClick={handleSynonymsButtonClick}>Search</Button>
                    {synonymsLoading && <div className={classes.loader}><CircularProgress/></div>}
                    {synonymsError &&
                        <Typography variant="body1" className={classes.errorText}>{synonymsError}</Typography>}
                    {synonymsData && <SynonymsComponent data={synonymsData}/>}
                </div>
            </Modal>

            {/* Masking Modal */}
            <Modal
                open={maskingModalOpen}
                onClose={handleMaskingModalClose}
                aria-labelledby="masking-modal-title"
                aria-describedby="masking-modal-description"
                className={classes.modalContainer}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    classes: {
                        root: classes.customBackdrop,
                    },
                }}
            >
                <div className={classes.modalContent}>
                    <IconButton className={classes.closeButton} onClick={handleMaskingModalClose}>
                        <CloseIcon/>
                    </IconButton>
                    <h2 id="masking-modal-title">Masked Text</h2>
                    <TextField
                        label="Enter words"
                        multiline
                        rows={4}
                        variant="outlined"
                        value={maskingInput}
                        onChange={handleMaskingInputChange}
                    />
                    <Button variant="contained" onClick={handleMaskingButtonClick}>Search</Button>
                    {maskingLoading && <div className={classes.loader}><CircularProgress/></div>}
                    {maskingError &&
                        <Typography variant="body1" className={classes.errorText}>{maskingError}</Typography>}
                    {maskingData && <ScrollableText text={maskingData}/>}
                </div>
            </Modal>
        </div>
    );
};

export default FileTab;
