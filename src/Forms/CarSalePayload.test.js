import { describe, expect, it } from 'vitest';
import { createCarSalePayload } from './CarSalePayload';

describe('createCarSalePayload', () => {
  it('creates legal text payloads for saved people, vehicles and agents', () => {
    const payload = createCarSalePayload({
      vendorStates: {
        nombre: 'Maria 2',
        apellido: 'Lopez',
        departamento: 'San Salvador',
        municipio: 'San Salvador Centro',
        domicilio: 'Colonia 10',
        documento: '12345678-9',
        genero: 'Femenino',
        edad: '35',
        oficio: 'Abogada 2',
      },
      personStates: {
        nombre: 'Carlos',
        apellido: 'Perez',
        departamento: 'La Libertad',
        municipio: 'Santa Tecla',
        domicilio: 'Residencial 5',
        documento: '87654321-0',
        genero: 'Masculino',
        edad: '30',
        oficio: 'Ingeniero',
      },
      carStates: {
        placa: 'P123456',
        marca: 'Toyota',
        modelo: 'K3000S',
        color: 'Azul',
        fabricado: '2020',
        capacidad: '5',
        unidad_capacidad: 'ASS',
        dominio: 'Propiedad',
        clase: 'Automóvil',
        tipo: 'Sedán',
        num_motor: 'M123',
        num_chasis: 'C456',
        num_vin: 'VIN789',
      },
      detailStates: {
        precio: '10000.50',
        departamento: 'La Libertad',
        municipio: 'Santa Tecla',
        domicilio: 'Santa Tecla',
        fecha_firma: '2026-05-26',
        hora_firma: '10:30',
        calidad_de: 'Propiedad',
        institucion: '',
        identifica_vendedor: 'No',
        identifica_comprador: 'Si',
      },
      agentStates: {
        nombres: 'Ana',
        apellidos: 'Garcia',
        departamento: 'La Libertad',
        municipio: 'Santa Tecla',
        distrito: 'Distrito 1',
        genero: 'Femenino',
        rol: 'Notario',
      },
    });

    expect(payload.vendedor.nombre).toBe('Maria DOS');
    expect(payload.vendedor.edad).toBe('TREINTA Y CINCO');
    expect(payload.vendedor.documento).toBe(
      'UNO DOS TRES CUATRO CINCO SEIS SIETE OCHO-NUEVE'
    );
    expect(payload.comprador.domicilio).toBe(
      'Residencial CINCO, Municipio de Santa Tecla'
    );
    expect(payload.vehiculo.modelo).toBe('K TRES MIL S');
    expect(payload.vehiculo.capacidad).toBe('CINCO ASS');
    expect(payload.vehiculo.clase).toBe('Automóvil');
    expect(payload.vehiculo.tipo).toBe('Sedán');
    expect(payload.documento.precio).toBe('DIEZ MIL CON CINCUENTA CENTAVOS');
    expect(payload.documento.fecha_firma).toBe(
      'VEINTISÉIS DE MAYO DE DOS MIL VEINTISÉIS'
    );
    expect(payload.documento.hora_firma).toBe('DIEZ HORAS CON TREINTA MINUTOS');
    expect(payload.agente_juridico.rol).toBe('Notario');
    expect(payload.agente_juridico.domicilio).toBe(
      'Distrito UNO, Municipio de Santa Tecla'
    );
  });

  it('keeps the tonnage unit for trucks', () => {
    const payload = createCarSalePayload({
      vendorStates: {},
      personStates: {},
      carStates: {
        capacidad: '2.00',
        unidad_capacidad: 'TON',
      },
      detailStates: {},
      agentStates: {},
    });

    expect(payload.vehiculo.capacidad).toBe('DOS TON');
  });

  it('keeps the represented company separate from the appearing person', () => {
    const payload = createCarSalePayload({
      vendorStates: {
        nombre: 'Jesús',
        apellido: 'Álvarez',
        departamento: 'San Salvador',
        municipio: 'San Salvador Centro',
        domicilio: 'San Salvador',
        documento: '12345678-9',
        genero: 'Masculino',
        edad: '69',
        oficio: 'Empleado',
        actua_por_sociedad: true,
        sociedad_nombre: 'Solaristmo, S.A. de C.V.',
        sociedad_abreviatura: 'Solaristmo',
        sociedad_nacionalidad: 'Salvadoreña',
        sociedad_departamento: 'San Salvador',
        sociedad_municipio: 'San Salvador Centro',
        sociedad_domicilio: 'San Salvador',
        sociedad_nit: '0614-310124-106-5',
        sociedad_cargo: 'Administrador Único por 7 años',
        sociedad_personeria_tipo: 'Credencial de elección',
        sociedad_personeria: 'Escritura número 446, libro 4885',
      },
      personStates: {},
      carStates: {},
      detailStates: {},
      agentStates: {},
    });

    expect(payload.vendedor.nombre).toBe('Jesús');
    expect(payload.vendedor.sociedad.nombre).toBe('Solaristmo, S.A. de C.V.');
    expect(payload.vendedor.sociedad.nit).toBe(
      'CERO SEIS UNO CUATRO-TRES UNO CERO UNO DOS CUATRO-UNO CERO SEIS-CINCO'
    );
    expect(payload.vendedor.sociedad.cargo_representante).toBe(
      'Administrador Único por SIETE años'
    );
    expect(payload.comprador.sociedad).toBeNull();
  });

  it('renders decimal vehicle capacity as a measurement', () => {
    const payload = createCarSalePayload({
      vendorStates: {},
      personStates: {},
      carStates: {
        capacidad: '1.50',
        unidad_capacidad: 'TON',
      },
      detailStates: {},
      agentStates: {},
    });

    expect(payload.vehiculo.capacidad).toBe('UNO PUNTO CINCUENTA TON');
    expect(payload.vehiculo.capacidad).not.toContain('CENTAVOS');
  });

  it('includes the exclusive heavy truck specifications', () => {
    const payload = createCarSalePayload({
      vendorStates: {},
      personStates: {},
      carStates: {
        clase: 'Camión pesado',
        tipo_capacidad: 'Carga seca',
        ejes: '3',
        tara: '8500',
        cap_carga: '12000',
        cap_maxima: '20500',
        traccion: '6x4',
      },
      detailStates: {},
      agentStates: {},
    });

    expect(payload.vehiculo.capacidad).toBe('Carga seca');
    expect(payload.vehiculo.ejes).toBe('TRES');
    expect(payload.vehiculo.tara).toBe('OCHO MIL QUINIENTOS');
    expect(payload.vehiculo.cap_carga).toBe('DOCE MIL');
    expect(payload.vehiculo.cap_maxima).toBe('VEINTE MIL QUINIENTOS');
    expect(payload.vehiculo.traccion).toBe('SEIS x CUATRO');
  });
});
