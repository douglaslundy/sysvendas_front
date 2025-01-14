import React, { useEffect, useState } from 'react';

const ModalPage = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 20000); // Fecha após 20 segundos

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                background: '#ffffff',
                borderRadius: '15px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                padding: '30px',
                width: '40%',
                maxWidth: '600px',
                textAlign: 'center',
                position: 'relative'
            }}>
                <button onClick={handleClose} style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    color: '#1e293b'
                }}>×</button>
                <h1 style={{
                    fontSize: '1.8rem',
                    marginBottom: '20px',
                    color: '#1e293b'
                }}>Sua licença expira em {Math.round((new Date('2025-02-01') - new Date((`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`).toString())) / (1000 * 60 * 60 * 24))} dias!</h1>
                <p><strong>NÃO FIQUE SEM SISTEMA!</strong></p>
                <p>Renovando até o dia <strong>20/01/2025</strong>, você pagará somente:</p>
                <div style={{
                    fontSize: '1.5rem',
                    margin: '20px 0'
                }}>
                    <del style={{
                        color: '#ef4444',
                        fontSize: '1.2rem',
                        marginRight: '10px'
                    }}>R$ 1920,00</del>
                    <span style={{
                        color: '#459DF7',
                        fontWeight: 'bold'
                    }}>R$ 1799,00</span>
                </div>
                <div style={{
                    marginTop: '20px',
                    lineHeight: '1.6'
                }}>
                    <p>Pagamento via PIX: <span style={{
                        fontWeight: 'bold',
                        color: '#2563eb'
                    }}>08449222699</span></p>
                    <p>Solicite através de nosso WhatsApp <a href="https://wa.me/5535984297193?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20o%20link%20de%20pagamento%20para%20renova%C3%A7%C3%A3o%20do%20SysVendas." style={{
                        fontWeight: 'bold',
                        color: '#2563eb',
                        textDecoration: 'none'
                    }}>35984297193</a> o link para pagamento via cartão.</p>
                </div>
                <footer style={{
                    marginTop: '30px',
                    fontSize: '0.9rem',
                    color: '#64748b'
                }}>
                    &copy; 2024 DLSISTEMAS - Todos os direitos reservados.
                </footer>
            </div>
        </div>
    );
};

export default ModalPage;