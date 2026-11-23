import {
  replaceNumericSequences,
  toLegalDate,
  toLegalIdentifier,
  toLegalNumber,
  toLegalPercentage,
  toLegalTime,
} from '../Functions/LegalDocumentText';
import { calculateMutualPreview } from './MutualFinancialPreview';
import { createVehiclePayload } from './CarSalePayload';
import {
  createAgentPayload,
  createPersonPayload,
  legalSettlement,
} from './LegalPayload';

export const createMutualPayload = ({
  debtor,
  creditor,
  guarantor,
  pledgedVehicle,
  terms,
  agent,
}) => {
  const preview = calculateMutualPreview(terms);
  const signingPlace = legalSettlement(
    terms.signingDistrict,
    terms.signingMunicipality
  );
  return {
    deudor: createPersonPayload(debtor),
    acreedor: createPersonPayload(creditor),
    fiador:
      terms.guaranteeType === 'PERSONAL_GUARANTOR'
        ? createPersonPayload(guarantor)
        : null,
    garantia_prendaria:
      terms.guaranteeType === 'VEHICLE_PLEDGE'
        ? {
            vehiculo: createVehiclePayload(pledgedVehicle),
            valor: toLegalNumber(terms.pledgeValue),
          }
        : null,
    condiciones: {
      monto: toLegalNumber(terms.amount),
      plazo:
        terms.paymentScheduleMode === 'CUSTOM'
          ? 'SEGÚN LAS FECHAS INDIVIDUALMENTE PACTADAS'
          : terms.termMode === 'SPECIFIC_DATE'
            ? 'QUE FINALIZA EN LA FECHA PACTADA'
            : replaceNumericSequences(terms.term),
      fecha_vencimiento: toLegalDate(preview?.dueDate || terms.dueDate),
      numero_cuotas: toLegalNumber(
        preview?.installments.length || terms.installmentCount
      ),
      monto_cuota: toLegalNumber(
        preview?.installmentAmount || terms.installmentAmount
      ),
      metodo_pago: terms.paymentMethod,
      banco_pago: replaceNumericSequences(terms.paymentBank),
      cuenta_pago: toLegalIdentifier(terms.paymentAccount),
      detalles_pago: replaceNumericSequences(terms.paymentDetails),
      interes_mensual:
        terms.paymentScheduleMode === 'CUSTOM'
          ? ''
          : toLegalPercentage(terms.monthlyInterest),
      interes_mora: toLegalPercentage(terms.defaultInterest),
      periodo_interes_mora: terms.defaultInterestPeriod,
      destino_fondos: replaceNumericSequences(terms.fundsPurpose),
      garantia_letra_cambio: terms.billOfExchangeGuarantee,
      fecha_vencimiento_garantia: terms.billOfExchangeGuarantee
        ? toLegalDate(terms.guaranteeDueDate)
        : '',
      gastos_administrativos: toLegalPercentage(terms.administrativeExpenses),
      domicilio_especial: replaceNumericSequences(signingPlace),
      lugar_firma: replaceNumericSequences(signingPlace),
      departamento_firma: replaceNumericSequences(terms.signingState),
      fecha_firma: toLegalDate(terms.signingDate),
      hora_firma: toLegalTime(terms.signingTime),
      identifica_deudor: terms.identifiesDebtor,
      identifica_acreedor: terms.identifiesCreditor,
      monto_numerico: terms.amount,
      modalidad_plazo: terms.termMode,
      cantidad_plazo:
        terms.termMode === 'DURATION' ? Number(terms.termQuantity) : null,
      unidad_plazo: terms.termMode === 'DURATION' ? terms.termUnit : null,
      fecha_inicio: terms.signingDate,
      fecha_vencimiento_iso: preview?.dueDate || terms.dueDate,
      numero_cuotas_numerico:
        preview?.installments.length || Number(terms.installmentCount),
      tasa_interes_mensual:
        terms.paymentScheduleMode === 'CUSTOM' ? 0 : terms.monthlyInterest || 0,
      modalidad_plan_pagos: terms.paymentScheduleMode,
      cuotas_personalizadas:
        terms.paymentScheduleMode === 'CUSTOM'
          ? terms.customInstallments.map((installment) => ({
              fecha: installment.date,
              capital: installment.capital,
              interes: installment.interest || 0,
            }))
          : [],
      permite_abonos_anticipados: terms.allowsEarlyPayments,
      condiciones_abonos_anticipados: terms.allowsEarlyPayments
        ? replaceNumericSequences(terms.earlyPaymentTerms)
        : '',
      tipo_instrumento: terms.instrumentType,
      tipo_garantia: terms.guaranteeType,
      numero_escritura:
        terms.instrumentType === 'PUBLIC_DEED'
          ? Number(terms.deedNumber)
          : null,
      numero_escritura_texto:
        terms.instrumentType === 'PUBLIC_DEED'
          ? toLegalNumber(terms.deedNumber)
          : '',
      detalles_garantia: replaceNumericSequences(terms.guaranteeDetails),
    },
    agente_juridico: createAgentPayload(agent),
  };
};
