/**
 * Factur-X / ZUGFeRD 2.x — EN 16931 (BASIC) profile generator
 * Spec: https://www.fnfe-mpe.org/factur-x/
 */

import type { Invoice, Profile } from '@/types';

function fmt(n: number) {
  return n.toFixed(2);
}

function fmtDate(iso: string) {
  // EN 16931 requires YYYYMMDD
  return iso.replace(/-/g, '');
}

function escXml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Document type codes (ISO 6931)
function typeCode(docType: string): string {
  if (docType === 'credit_note') return '381';
  if (docType === 'quote') return '84';
  return '380'; // invoice
}

// Aggregate VAT by rate
function groupVat(invoice: Invoice) {
  const map: Record<number, { base: number; vat: number }> = {};
  for (const item of invoice.items) {
    const rate = item.vat_rate ?? 20;
    if (!map[rate]) map[rate] = { base: 0, vat: 0 };
    const lineHT = item.quantity * item.unit_price;
    map[rate].base += lineHT;
    map[rate].vat += lineHT * (rate / 100);
  }
  return Object.entries(map).map(([rate, { base, vat }]) => ({
    rate: Number(rate),
    base,
    vat,
  }));
}

export function generateFacturXML(invoice: Invoice, profile: Profile): string {
  const seller = {
    name: profile.company_name || 'DictaBill User',
    address: profile.address || '',
    postalCode: profile.postal_code || '',
    city: profile.city || '',
    country: 'FR',
    siret: profile.siret || '',
    vatNumber: profile.vat_number || '',
  };

  const buyer = {
    name: invoice.client?.name || invoice.client_name_override || '',
    address: invoice.client?.address || '',
    postalCode: invoice.client?.postal_code || '',
    city: invoice.client?.city || '',
    country: 'FR',
    siret: invoice.client?.siret || '',
    vatNumber: invoice.client?.vat_number || '',
    email: invoice.client?.email || '',
  };

  const vatGroups = groupVat(invoice);

  const lineItems = invoice.items.map((item, i) => {
    const lineTotal = item.quantity * item.unit_price;
    const rate = item.vat_rate ?? 20;
    return `
    <ram:IncludedSupplyChainTradeLineItem>
      <ram:AssociatedDocumentLineDocument>
        <ram:LineID>${i + 1}</ram:LineID>
      </ram:AssociatedDocumentLineDocument>
      <ram:SpecifiedTradeProduct>
        <ram:Name>${escXml(item.description)}</ram:Name>
      </ram:SpecifiedTradeProduct>
      <ram:SpecifiedLineTradeAgreement>
        <ram:NetPriceProductTradePrice>
          <ram:ChargeAmount>${fmt(item.unit_price)}</ram:ChargeAmount>
        </ram:NetPriceProductTradePrice>
      </ram:SpecifiedLineTradeAgreement>
      <ram:SpecifiedLineTradeDelivery>
        <ram:BilledQuantity unitCode="C62">${item.quantity}</ram:BilledQuantity>
      </ram:SpecifiedLineTradeDelivery>
      <ram:SpecifiedLineTradeSettlement>
        <ram:ApplicableTradeTax>
          <ram:TypeCode>VAT</ram:TypeCode>
          <ram:CategoryCode>${rate === 0 ? 'Z' : 'S'}</ram:CategoryCode>
          <ram:RateApplicablePercent>${rate}</ram:RateApplicablePercent>
        </ram:ApplicableTradeTax>
        <ram:SpecifiedTradeSettlementLineMonetarySummation>
          <ram:LineTotalAmount>${fmt(lineTotal)}</ram:LineTotalAmount>
        </ram:SpecifiedTradeSettlementLineMonetarySummation>
      </ram:SpecifiedLineTradeSettlement>
    </ram:IncludedSupplyChainTradeLineItem>`;
  }).join('');

  const vatBreakdown = vatGroups.map(({ rate, base, vat }) => `
    <ram:ApplicableTradeTax>
      <ram:CalculatedAmount>${fmt(vat)}</ram:CalculatedAmount>
      <ram:TypeCode>VAT</ram:TypeCode>
      <ram:BasisAmount>${fmt(base)}</ram:BasisAmount>
      <ram:CategoryCode>${rate === 0 ? 'Z' : 'S'}</ram:CategoryCode>
      <ram:RateApplicablePercent>${rate}</ram:RateApplicablePercent>
    </ram:ApplicableTradeTax>`).join('');

  const dueDateXml = invoice.due_date ? `
      <ram:SpecifiedTradePaymentTerms>
        <ram:DueDateDateTime>
          <udt:DateTimeString format="102">${fmtDate(invoice.due_date)}</udt:DateTimeString>
        </ram:DueDateDateTime>
      </ram:SpecifiedTradePaymentTerms>` : '';

  const notesXml = invoice.notes ? `
  <rsm:ExchangedDocument>
    <ram:ID>${escXml(invoice.number)}</ram:ID>
    <ram:TypeCode>${typeCode(invoice.document_type)}</ram:TypeCode>
    <ram:IssueDateTime>
      <udt:DateTimeString format="102">${fmtDate(invoice.issue_date)}</udt:DateTimeString>
    </ram:IssueDateTime>
    <ram:IncludedNote>
      <ram:Content>${escXml(invoice.notes)}</ram:Content>
    </ram:IncludedNote>
  </rsm:ExchangedDocument>` : `
  <rsm:ExchangedDocument>
    <ram:ID>${escXml(invoice.number)}</ram:ID>
    <ram:TypeCode>${typeCode(invoice.document_type)}</ram:TypeCode>
    <ram:IssueDateTime>
      <udt:DateTimeString format="102">${fmtDate(invoice.issue_date)}</udt:DateTimeString>
    </ram:IssueDateTime>
  </rsm:ExchangedDocument>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<rsm:CrossIndustryInvoice
  xmlns:rsm="urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100"
  xmlns:ram="urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100"
  xmlns:udt="urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100"
  xmlns:qdt="urn:un:unece:uncefact:data:standard:QualifiedDataType:100"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

  <rsm:ExchangedDocumentContext>
    <ram:GuidelineSpecifiedDocumentContextParameter>
      <ram:ID>urn:factur-x.eu:1p0:en16931</ram:ID>
    </ram:GuidelineSpecifiedDocumentContextParameter>
  </rsm:ExchangedDocumentContext>

  ${notesXml}

  <rsm:SupplyChainTradeTransaction>
    ${lineItems}

    <ram:ApplicableHeaderTradeAgreement>
      <ram:SellerTradeParty>
        <ram:Name>${escXml(seller.name)}</ram:Name>
        ${seller.siret ? `<ram:ID>${escXml(seller.siret)}</ram:ID>` : ''}
        <ram:PostalTradeAddress>
          ${seller.address ? `<ram:LineOne>${escXml(seller.address)}</ram:LineOne>` : ''}
          ${seller.postalCode ? `<ram:PostcodeCode>${escXml(seller.postalCode)}</ram:PostcodeCode>` : ''}
          ${seller.city ? `<ram:CityName>${escXml(seller.city)}</ram:CityName>` : ''}
          <ram:CountryID>${seller.country}</ram:CountryID>
        </ram:PostalTradeAddress>
        ${seller.vatNumber ? `
        <ram:SpecifiedTaxRegistration>
          <ram:ID schemeID="VA">${escXml(seller.vatNumber)}</ram:ID>
        </ram:SpecifiedTaxRegistration>` : ''}
        ${seller.siret ? `
        <ram:SpecifiedTaxRegistration>
          <ram:ID schemeID="FC">${escXml(seller.siret)}</ram:ID>
        </ram:SpecifiedTaxRegistration>` : ''}
      </ram:SellerTradeParty>

      <ram:BuyerTradeParty>
        <ram:Name>${escXml(buyer.name)}</ram:Name>
        ${buyer.siret ? `<ram:ID>${escXml(buyer.siret)}</ram:ID>` : ''}
        <ram:PostalTradeAddress>
          ${buyer.address ? `<ram:LineOne>${escXml(buyer.address)}</ram:LineOne>` : ''}
          ${buyer.postalCode ? `<ram:PostcodeCode>${escXml(buyer.postalCode)}</ram:PostcodeCode>` : ''}
          ${buyer.city ? `<ram:CityName>${escXml(buyer.city)}</ram:CityName>` : ''}
          <ram:CountryID>${buyer.country}</ram:CountryID>
        </ram:PostalTradeAddress>
        ${buyer.vatNumber ? `
        <ram:SpecifiedTaxRegistration>
          <ram:ID schemeID="VA">${escXml(buyer.vatNumber)}</ram:ID>
        </ram:SpecifiedTaxRegistration>` : ''}
        ${buyer.email ? `
        <ram:URIUniversalCommunication>
          <ram:URIID schemeID="EM">${escXml(buyer.email)}</ram:URIID>
        </ram:URIUniversalCommunication>` : ''}
      </ram:BuyerTradeParty>
    </ram:ApplicableHeaderTradeAgreement>

    <ram:ApplicableHeaderTradeDelivery />

    <ram:ApplicableHeaderTradeSettlement>
      <ram:InvoiceCurrencyCode>EUR</ram:InvoiceCurrencyCode>
      ${vatBreakdown}
      ${dueDateXml}
      <ram:SpecifiedTradeSettlementHeaderMonetarySummation>
        <ram:LineTotalAmount>${fmt(invoice.subtotal)}</ram:LineTotalAmount>
        <ram:TaxBasisTotalAmount>${fmt(invoice.subtotal)}</ram:TaxBasisTotalAmount>
        <ram:TaxTotalAmount currencyID="EUR">${fmt(invoice.vat_amount)}</ram:TaxTotalAmount>
        <ram:GrandTotalAmount>${fmt(invoice.total)}</ram:GrandTotalAmount>
        <ram:DuePayableAmount>${fmt(invoice.total)}</ram:DuePayableAmount>
      </ram:SpecifiedTradeSettlementHeaderMonetarySummation>
    </ram:ApplicableHeaderTradeSettlement>
  </rsm:SupplyChainTradeTransaction>
</rsm:CrossIndustryInvoice>`;
}

/**
 * Embed Factur-X XML inside a PDF (client-side, using pdf-lib).
 * Returns the new PDF bytes.
 */
export async function embedFacturXInPDF(
  pdfBytes: ArrayBuffer,
  xmlString: string,
  invoiceNumber: string,
): Promise<Uint8Array> {
  const { PDFDocument, PDFName, PDFString, PDFDict, PDFArray, AFRelationship } = await import('pdf-lib');

  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Set PDF/A-3 metadata via XMP
  const xmpMeta = `<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about="" xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/">
      <pdfaid:part>3</pdfaid:part>
      <pdfaid:conformance>B</pdfaid:conformance>
    </rdf:Description>
    <rdf:Description rdf:about="" xmlns:fx="urn:factur-x:pdfa:CrossIndustryDocument:invoice:1p0#">
      <fx:DocumentFileName>factur-x.xml</fx:DocumentFileName>
      <fx:DocumentType>INVOICE</fx:DocumentType>
      <fx:Version>1.0</fx:Version>
      <fx:ConformanceLevel>EN 16931</fx:ConformanceLevel>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;

  const xmlBytes = new TextEncoder().encode(xmlString);

  // Attach with AFRelationship.Alternative (required for Factur-X)
  await pdfDoc.attach(xmlBytes, 'factur-x.xml', {
    mimeType: 'text/xml',
    description: 'Factur-X Invoice',
    creationDate: new Date(),
    modificationDate: new Date(),
    afRelationship: AFRelationship.Alternative,
  });

  // Set document info
  pdfDoc.setTitle(`Facture ${invoiceNumber}`);
  pdfDoc.setSubject('Factur-X Invoice EN 16931');
  pdfDoc.setProducer('DictaBill');
  pdfDoc.setCreator('DictaBill (dictabill.com)');
  pdfDoc.setKeywords(['Factur-X', 'EN 16931', 'invoice']);

  return pdfDoc.save();
}
