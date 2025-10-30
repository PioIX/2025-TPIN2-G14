/*'use client'
import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import styles from '@/components/PopUp.module.css'

const PopUp = ({isError = false, isMessage = false,boton,children}) => {

    return <Popup trigger={boton} position="right center">
        <div>{children}</div>
    </Popup>
}



export default PopUp;*/
'use client'
import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import styles from '@/components/PopUp.module.css'

const PopUp = ({open, onClose, tipo, boton, children}) => {
    const modalClass = tipo === 1 ? `${styles.modal} ${styles.success}` : `${styles.modal} ${styles.error}`;

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    // Si tiene botón (trigger mode)
    if (boton) {
        return (
            <Popup 
                trigger={boton}
                position="center center"
                modal
                nested
                overlayStyle={{ 
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                contentStyle={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    width: 'auto'
                }}
            >
                {close => (
                    <div className={styles.modal}>
                        <button 
                            className={styles.close} 
                            onClick={close}
                        >
                            &times;
                        </button>
                        <div className={styles.content}>
                            {children}
                        </div>
                    </div>
                )}
            </Popup>
        )
    }

    // Modo controlado (con open/onClose)
    return (
        <Popup 
            open={open} 
            position="center center"
            modal
            nested
            overlayStyle={{ 
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            contentStyle={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                width: 'auto'
            }}
        >
            <div className={modalClass}>
                <button 
                    className={styles.close} 
                    onClick={handleClose}
                >
                    &times;
                </button>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </Popup>
    )
}

export default PopUp;