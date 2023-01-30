const { faker } = require('@faker-js/faker');
const { Decimal } = require('decimal.js');
const fs = require('fs');

function createTransactionRecord() {
  const reference = faker.helpers.unique(() => faker.finance.account(6));
  const accountNumber = faker.finance.iban('DE').replaceAll(' ', '');
  const description = faker.lorem.words(5);
  const startBalance = faker.datatype.float({ max: 1000000, precision: 0.01 });
  const mutation = faker.datatype.float(0.01);
  const endBalance = new Decimal(startBalance)
    .plus(new Decimal(mutation))
    .toNumber();

  return {
    reference,
    accountNumber,
    description,
    startBalance,
    mutation,
    endBalance,
  };
}

function generateXML(recordCount, file) {
  const data = [];
  for (let i = 0; i < recordCount; i++) {
    const record = createTransactionRecord();
    data.push(`
    <record reference="${record.reference}">
      <accountNumber>${record.accountNumber}</accountNumber>
      <description>${record.description}</description>
      <startBalance>${record.startBalance}</startBalance>
      <mutation>${record.mutation}</mutation>
      <endBalance>${record.endBalance}</endBalance>
    </record>`);
  }
  fs.writeFileSync(`../${file}`, `<records>${data.join('')}</records>`);
}

function generateCSV(recordCount, file) {
  const data = [];
  for (let i = 0; i < recordCount; i++) {
    const record = createTransactionRecord();
    data.push(`${record.reference},${record.accountNumber},${record.description},${record.startBalance},${record.mutation},${record.endBalance}
`);
  }
  fs.writeFileSync(
    `../${file}`,
    `Reference,Account Number,Description,Start Balance,Mutation,End Balance
${data.join('')}`
  );
}

generateXML(100000, 'large.xml');
generateCSV(100000, 'large.csv');
