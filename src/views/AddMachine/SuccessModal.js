import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Slide from "@material-ui/core/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const SuccessIcon = () => <img src='/assets/success.png' style={{ 
    width: '127px',
    height: '92px',
    margin: '20px auto',
    display: 'flex'
 }} />


export default function AlertDialogSlide({ show, handleCloseModal }) {
    return (
        <div>
            <Dialog
                open={show}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseModal}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent style={{
                    'display': 'flex',
                    'flex-direction': 'column',
                    'justify-content': 'center',
                    'align-items': 'center'
                }}>
                    <SuccessIcon />
                    <DialogContentText id="alert-dialog-slide-description" style={{'text-align': 'center' }}>
                        Congratulations, add mine machine success
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}
