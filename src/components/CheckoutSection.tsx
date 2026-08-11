import { useState, useEffect } from 'react';
import { Reveal } from './Reveal';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import { Copy, Check } from 'lucide-react';

initMercadoPago('APP_USR-882ec9a9-4813-4c07-8fe7-53d5a0300dad', { locale: 'pt-BR' });

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function CheckoutSection() {
  const [profile, setProfile] = useState<'graduando' | 'profissional'>('graduando');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao'>('pix');
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<{base64: string, copiaCola: string, idPagamento: string} | null>(null);
  const [paymentApproved, setPaymentApproved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const amount = profile === 'graduando' ? 70.00 : 100.00;
  const price = profile === 'graduando' ? "R$ 70,00" : "R$ 100,00";

  // Polling para checar se o pagamento foi aprovado
  useEffect(() => {
    let intervalId: any;
    
    if (qrCodeData && !paymentApproved) {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch(`${API_URL}/api/status-pagamento/${qrCodeData.idPagamento}`);
          const data = await res.json();
          if (data.status === 'approved') {
            setPaymentApproved(true);
            clearInterval(intervalId);
          }
        } catch (e) {
          console.error('Erro ao verificar status', e);
        }
      }, 5000); // Checa a cada 5 segundos
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [qrCodeData, paymentApproved]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/api/criar-pagamento-pix`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          email,
          cpf,
          telefone,
          perfil: profile,
          valor: amount
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Erro ao processar pagamento');
      }
      
      setQrCodeData({
        base64: data.qr_code_base64,
        copiaCola: data.qr_code_copia_cola,
        idPagamento: data.id_pagamento
      });
    } catch (err: any) {
      setError(err.message || 'Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="checkout-section" id="inscricao">
      <div className="section-inner">
        <Reveal>
          <header className="checkout-header">
            <p className="kicker">Garanta sua vaga</p>
            <h2>Inscrição</h2>
          </header>
        </Reveal>

        <div className="checkout-grid">
          {/* Left Column: Form */}
          <Reveal delay={100} className="checkout-form-container">
            <div className="glass-panel">
              <h3 className="panel-title">Seus Dados</h3>
              <form className="checkout-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="nome">Nome Completo</label>
                  <input type="text" id="nome" name="nome" placeholder="Digite seu nome" required value={nome} onChange={e => setNome(e.target.value)} disabled={loading || !!qrCodeData || paymentApproved} />
                </div>
                <div className="form-group">
                  <label htmlFor="email">E-mail</label>
                  <input type="email" id="email" name="email" placeholder="seu@email.com" required value={email} onChange={e => setEmail(e.target.value)} disabled={loading || !!qrCodeData || paymentApproved} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cpf">CPF</label>
                    <input type="text" id="cpf" name="cpf" placeholder="000.000.000-00" required value={cpf} onChange={e => setCpf(e.target.value)} disabled={loading || !!qrCodeData || paymentApproved} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="telefone">Telefone</label>
                    <input type="tel" id="telefone" name="telefone" placeholder="(00) 00000-0000" required value={telefone} onChange={e => setTelefone(e.target.value)} disabled={loading || !!qrCodeData || paymentApproved} />
                  </div>
                </div>
              </form>
            </div>
          </Reveal>

          {/* Right Column: Summary & Payment */}
          <Reveal delay={200} className="checkout-summary-container">
            <div className="glass-panel summary-panel">
              <h3 className="panel-title">Resumo do Pedido</h3>
              
              {!qrCodeData && !paymentApproved ? (
                <>
                  <div className="profile-selector">
                    <p className="selector-label">Selecione seu perfil:</p>
                    <div className="toggle-group">
                      <button 
                        type="button"
                        className={`toggle-btn ${profile === 'graduando' ? 'active' : ''}`}
                        onClick={() => setProfile('graduando')}
                        disabled={loading}
                      >
                        Graduando
                      </button>
                      <button 
                        type="button"
                        className={`toggle-btn ${profile === 'profissional' ? 'active' : ''}`}
                        onClick={() => setProfile('profissional')}
                        disabled={loading}
                      >
                        Profissional
                      </button>
                    </div>
                  </div>

                  <div className="payment-method-selector">
                    <p className="selector-label">Método de Pagamento:</p>
                    <div className="method-grid">
                      <button 
                        type="button"
                        className={`method-btn ${paymentMethod === 'pix' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('pix')}
                        disabled={loading}
                      >
                        PIX
                      </button>
                      <button 
                        type="button"
                        className={`method-btn ${paymentMethod === 'cartao' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('cartao')}
                        disabled={loading}
                      >
                        Cartão de Crédito
                      </button>
                    </div>
                  </div>

                  <div className="summary-total">
                    <span>Total a pagar:</span>
                    <span className="price">{price}</span>
                  </div>

                  {error && <p style={{color: '#ff6b6b', fontSize: '14px', marginBottom: '15px'}}>{error}</p>}

                  {paymentMethod === 'cartao' ? (
                    <div className="payment-brick-container" style={{ marginTop: '20px' }}>
                      <Payment
                        key={amount}
                        initialization={{ amount: amount }}
                        customization={{ 
                          paymentMethods: { creditCard: "all" }
                        }}
                        onSubmit={async (param) => {
                          const formData = { 
                            ...param.formData, 
                            metadata: { 
                              nome_pagador: nome,
                              email_pagador: email,
                              cpf_pagador: cpf,
                              telefone_pagador: telefone,
                              perfil_pagador: profile
                            } 
                          };
                          
                          // Garante que o payer existe
                          if (!formData.payer) formData.payer = {} as typeof formData.payer;
                          
                          // Injeta o Nome, Sobrenome, E-mail e CPF obrigatórios pelo Mercado Pago
                          if (nome) {
                            const partesNome = nome.trim().split(" ");
                            formData.payer.first_name = partesNome[0] || "Cliente";
                            formData.payer.last_name = partesNome.slice(1).join(" ") || "Inscrito";
                          }
                          if (email) formData.payer.email = email;
                          if (cpf) {
                            formData.payer.identification = { type: "CPF", number: cpf.replace(/\D/g, '') };
                          }

                          return new Promise<void>((resolve, reject) => {
                            fetch(`${API_URL}/api/criar-pagamento-cartao`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(formData),
                            })
                            .then(async (res) => {
                              const data = await res.json();
                              if (!res.ok) throw new Error(data.detail || "Erro");
                              return data;
                            })
                            .then((data) => {
                              if (data.status === 'approved') {
                                setPaymentApproved(true);
                              } else if (data.status === 'rejected') {
                                let msg = "O pagamento foi recusado.";
                                switch (data.status_detail) {
                                  case "cc_rejected_insufficient_amount": msg = "Saldo insuficiente no cartão."; break;
                                  case "cc_rejected_bad_filled_security_code": msg = "Código de segurança (CVV) inválido."; break;
                                  case "cc_rejected_bad_filled_date": msg = "Data de validade do cartão incorreta."; break;
                                  case "cc_rejected_high_risk": msg = "Pagamento recusado pelo sistema antifraude."; break;
                                  case "cc_rejected_call_for_authorize": msg = "Pagamento não autorizado. Ligue para o seu banco."; break;
                                  case "cc_rejected_max_attempts": msg = "Limite de tentativas excedido para este cartão."; break;
                                  case "cc_rejected_card_disabled": msg = "O cartão informado está inativo ou bloqueado."; break;
                                  case "cc_rejected_bad_filled_other": msg = "Algum dado do cartão está incorreto. Verifique e tente novamente."; break;
                                }
                                setError(msg);
                              } else {
                                alert("Aviso: o seu pagamento foi para análise de segurança (Status: " + data.status + "). Aguarde a confirmação no e-mail.");
                              }
                              resolve();
                            })
                            .catch((err) => {
                              setError(err.message === "Erro" ? "Falha ao processar pagamento com cartão." : err.message);
                              reject();
                            });
                          });
                        }}
                      />
                    </div>
                  ) : (
                    <button type="submit" className="checkout-submit-btn" disabled={loading} onClick={handleSubmit}>
                      {loading ? 'Processando...' : 'Finalizar Inscrição'}
                    </button>
                  )}
                </>
              ) : paymentApproved ? (
                <div className="success-container" style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '60px', marginBottom: '15px' }}>✅</div>
                  <h3 style={{ color: '#75d16c', fontWeight: 'bold', marginBottom: '15px', fontSize: '24px' }}>Pagamento Aprovado!</h3>
                  <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', marginBottom: '15px' }}>
                    Sua vaga no <strong>Amazon Tech Energy</strong> está garantida.
                  </p>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                    Enviamos um e-mail para <strong>{email}</strong> com a confirmação e os detalhes do evento. Nos vemos lá!
                  </p>
                </div>
              ) : qrCodeData ? (
                <div 
                  className="qr-code-container" 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    textAlign: 'center',
                    width: '100%',
                    padding: '10px 0'
                  }}
                >
                  <p style={{ color: '#75d16c', fontWeight: 'bold', marginBottom: '8px', fontSize: '18px' }}>Pedido gerado com sucesso!</p>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '20px' }}>
                    Escaneie o QR Code abaixo ou use o botão para copiar o código Pix:
                  </p>
                  
                  <div style={{ background: '#ffffff', padding: '12px', borderRadius: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                    <img 
                      src={`data:image/png;base64,${qrCodeData.base64}`} 
                      alt="QR Code Pix" 
                      style={{ width: '200px', height: '200px', borderRadius: '8px', display: 'block', margin: '0 auto' }}
                    />
                  </div>
                  
                  <div className="copia-cola" style={{ background: 'rgba(0,0,0,0.4)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', maxWidth: '100%', width: '100%', boxSizing: 'border-box', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ wordBreak: 'break-all', fontSize: '12px', color: 'rgba(255,255,255,0.85)', flex: 1 }}>
                      {qrCodeData.copiaCola}
                    </span>
                    <button
                      type="button"
                      aria-label="Copiar código Pix"
                      onClick={() => {
                        if (qrCodeData?.copiaCola) {
                          navigator.clipboard.writeText(qrCodeData.copiaCola);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2500);
                        }
                      }}
                      style={{
                        flexShrink: 0,
                        background: copied ? '#4caf50' : 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '6px',
                        padding: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      {copied ? <Check size={16} color="#fff" /> : <Copy size={16} color="rgba(255,255,255,0.85)" />}
                    </button>
                  </div>
                  
                  <button 
                    type="button"
                    className="checkout-submit-btn" 
                    style={{ 
                      marginTop: '5px', 
                      padding: '14px 24px', 
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: copied ? '#4caf50' : undefined
                    }}
                    onClick={() => {
                      if (qrCodeData?.copiaCola) {
                        navigator.clipboard.writeText(qrCodeData.copiaCola);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2500);
                      }
                    }}
                  >
                    {copied ? (
                      <>
                        <span>Código Pix Copiado!</span>
                        <span>✓</span>
                      </>
                    ) : (
                      <>
                        <span>📋</span>
                        <span>Copiar Código Pix (Copia e Cola)</span>
                      </>
                    )}
                  </button>
                </div>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
