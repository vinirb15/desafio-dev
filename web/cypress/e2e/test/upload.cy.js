describe('Fluxo de upload e atualização da listagem', () => {
  it('envia um arquivo .txt e verifica se a listagem é atualizada', () => {
    cy.visit('localhost:3000/');

    cy.get('body').then($body => {
      if ($body.text().includes('Sem resultados')) {
        cy.contains('Sem resultados').should('exist');
      } else {
        cy.get('[data-cy="lista-item"]').should('have.length.at.least', 1);
      }
    });

    cy.get('[data-cy="open-upload-modal"]').click();

    cy.fixture('CNAB.txt', 'binary').then((fileBinary) => {
      const blob = Cypress.Blob.binaryStringToBlob(fileBinary, 'text/plain');
      const file = new File([blob], 'CNAB.txt', { type: 'text/plain' });

      cy.window().then(async () => {
        const formData = new FormData();
        formData.append('file', file);

        return await fetch('http://localhost:5000/cnab/upload', {
          method: 'POST',
          body: formData,
        }).then(async (res) => {
          const data = await res.json();
          expect(res.status).to.eq(201);
          expect(data.message).to.eq('File uploaded successfully');
        });
      });
    });

    cy.get('[data-cy="close-modal-button"]').click();

    cy.get('[data-cy="list-itens"]', { timeout: 5000 }).should('have.length.at.least', 1);

  });
});
