import { useState } from "react";
import './style.css'

type InputModalProps = {
  onUploadSuccess?: () => void;
};

export default function InputModal({ onUploadSuccess }: InputModalProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  async function handleFileUpload() {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`${process.env.API_URL}/cnab/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar o arquivo");
      }

      alert("Arquivo enviado com sucesso!");
      setModalOpen(false);
      setSelectedFile(null);
      onUploadSuccess?.();
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar o arquivo");
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <>
      <button
        className='uploadButton'
        data-cy="open-upload-modal"
        onClick={() => setModalOpen(true)}
      >
        Enviar Arquivo .txt
      </button>

      {isModalOpen && (
        <div className='modalOverlay' onClick={() => !isUploading && setModalOpen(false)}>
          <div className='modalContent' onClick={(e) => e.stopPropagation()}>
            <h2>Upload de Arquivo</h2>
            <input type="file" accept=".txt" onChange={handleFileChange} disabled={isUploading} />

            {selectedFile && <p><strong>Selecionado:</strong> {selectedFile.name}</p>}

            <div style={{ marginTop: '1rem' }}>
              <button
                className='submitButton'
                onClick={handleFileUpload}
                data-cy="upload-file-button"
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? 'Enviando...' : 'Enviar'}
              </button>
              <button
                className='closeButton'
                onClick={() => setModalOpen(false)}
                data-cy="close-modal-button"
                disabled={isUploading}
                style={{ marginLeft: '0.5rem' }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
