/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeService } from './exchange.service';
import { User } from '../../domain/dto/user.entity.dto';
import { ExchangePrismaRepository } from '../../infraestructure/database/exchange.prisma.repository';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

const mockExchangeRepo = {
  getCambioSeguro: jest.fn(),
  ammountReceivedCalculation: jest.fn(),
  getExchangeHistory: jest.fn(),
  getExchangeHistoryDetail: jest.fn(),
  deleteExchangeHistory: jest.fn(),
};

const mockUser: User = {
  id: 'user123',
  email: 'test@example.com',
} as User;

describe('ExchangeService', () => {
  let service: ExchangeService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeService,
        {
          provide: ExchangePrismaRepository,
          useValue: mockExchangeRepo,
        },
      ],
    }).compile();

    service = module.get<ExchangeService>(ExchangeService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('getExchange', () => {
    it('debería devolver tasa de venta correctamente', async () => {
      mockExchangeRepo.getCambioSeguro.mockResolvedValue({
        sale_price: 3.8,
        purchase_price: 3.7,
        _id: 'rate123',
      });

      const result = await service.getExchange('venta', mockUser);

      expect(mockExchangeRepo.getCambioSeguro).toHaveBeenCalledWith(
        expect.any(String),
      );
      expect(result).toEqual({
        tipoDeCambio: 'venta',
        tasa: 3.8,
        user: mockUser,
        idTipoDeCambio: 'rate123',
      });
    });

    it('debería devolver tasa de compra correctamente', async () => {
      mockExchangeRepo.getCambioSeguro.mockResolvedValue({
        sale_price: 3.8,
        purchase_price: 3.7,
        _id: 'rate123',
      });

      const result = await service.getExchange('compra', mockUser);

      expect(result.tasa).toBe(3.7);
    });

    it('debería lanzar BadRequestException si tipoDeCambio es inválido', async () => {
      mockExchangeRepo.getCambioSeguro.mockResolvedValue({
        sale_price: 3.8,
        purchase_price: 3.7,
        _id: 'rate123',
      });

      await expect(
        service.getExchange('otro' as any, mockUser),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('calculateAmount', () => {
    it('debería calcular correctamente el monto', async () => {
      jest.spyOn(service, 'getExchange').mockResolvedValue({
        tipoDeCambio: 'venta',
        tasa: 3.8,
        user: mockUser,
        idTipoDeCambio: 'rate123',
      });

      mockExchangeRepo.ammountReceivedCalculation.mockResolvedValue({
        id: 'calc1',
        monto_enviar: 100,
        monto_recibir: 380,
      });

      const result = await service.calculateAmount(100, 'venta', mockUser);

      expect(service.getExchange).toHaveBeenCalledWith('venta', mockUser);
      expect(mockExchangeRepo.ammountReceivedCalculation).toHaveBeenCalledWith(
        'venta',
        'rate123',
        100,
        3.8,
        mockUser,
      );
      expect(result).toEqual({
        id: 'calc1',
        monto_enviar: 100,
        monto_recibir: 380,
        id_usuario: { id: mockUser.id, email: mockUser.email },
      });
    });

    it('debería lanzar InternalServerErrorException si ocurre un error', async () => {
      jest.spyOn(service, 'getExchange').mockRejectedValue(new Error('fail'));

      await expect(
        service.calculateAmount(100, 'venta', mockUser),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getExchangeHistory', () => {
    it('debería retornar historial de cambios correctamente', async () => {
      const mockResponse = {
        pagination: {
          totalItems: 2,
          totalPages: 1,
          currentPage: 1,
          pageSize: 10,
        },
        data: [],
      };
      mockExchangeRepo.getExchangeHistory.mockResolvedValue(mockResponse);

      const result = await service.getExchangeHistory(1, 10, mockUser);

      expect(mockExchangeRepo.getExchangeHistory).toHaveBeenCalledWith(
        1,
        10,
        mockUser,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getExchangeHistoryDetail', () => {
    it('debería retornar detalle correctamente', async () => {
      const mockDetail = { id: 'abc', monto_enviar: 100 };
      mockExchangeRepo.getExchangeHistoryDetail.mockResolvedValue(mockDetail);

      const result = await service.getExchangeHistoryDetail('abc', mockUser);

      expect(mockExchangeRepo.getExchangeHistoryDetail).toHaveBeenCalledWith(
        'abc',
        mockUser,
      );
      expect(result).toEqual(mockDetail);
    });
  });

  describe('deleteExchangeHistory', () => {
    it('debería eliminar historial correctamente', async () => {
      const mockDelete = { message: 'Eliminado correctamente' };
      mockExchangeRepo.deleteExchangeHistory.mockResolvedValue(mockDelete);

      const result = await service.deleteExchangeHistory('xyz', mockUser);

      expect(mockExchangeRepo.deleteExchangeHistory).toHaveBeenCalledWith(
        'xyz',
        mockUser,
      );
      expect(result).toEqual(mockDelete);
    });
  });
});
