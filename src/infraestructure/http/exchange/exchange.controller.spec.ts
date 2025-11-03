/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from '../../../application/exchange/exchange.service';
import { User } from '../../../domain/dto/user.entity.dto';

describe('ExchangeController', () => {
  let controller: ExchangeController;
  let service: jest.Mocked<ExchangeService>;
  const mockUser: User = { id: 'user123', email: 'test@example.com' } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangeController],
      providers: [
        {
          provide: ExchangeService,
          useValue: {
            getExchange: jest.fn(),
            calculateAmount: jest.fn(),
            getExchangeHistory: jest.fn(),
            getExchangeHistoryDetail: jest.fn(),
            deleteExchangeHistory: jest.fn(),
          },
        },
      ],
    }).compile();

    // controller = module.get<ExchangeController>(ExchangeController);
    controller = module.get<ExchangeController>(ExchangeController);
    service = module.get(ExchangeService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('getExchange', () => {
    it('debería llamar a exchangeService.getExchange con tipo y user', async () => {
      // service.getExchange.mockResolvedValue({ tipoDeCambio: 'venta' });
      service.getExchange.mockResolvedValue({
        idTipoDeCambio: '1',
        tasa: 3.5,
        user: mockUser,
        tipoDeCambio: 'venta',
      });

      const result = await controller.getExchange('venta', mockUser);

      expect(service.getExchange).toHaveBeenCalledWith('venta', mockUser);
      expect(result).toMatchObject({ tipoDeCambio: 'venta' });
    });
  });

  describe('calculateAmount', () => {
    it('debería llamar a exchangeService.calculateAmount correctamente', async () => {
      // const mockResponse = { total: 1200 };
      const mockResponse = {
        id: '6907ef121826b12d029bf1f2',
        tipo_de_cambio: 'compra',
        monto_enviar: 1,
        monto_recibir: 3.39,
        createdAt: new Date('2025-11-02T23:53:54.803Z'),
        tasa_de_cambio: {
          _id: '6903820d8c6dd7565a96cbbe',
          purchase_price: 3.39,
          sale_price: 0,
        },
        id_usuario: mockUser,
        estadoSolicitud: 'pendiente',
      };

      service.calculateAmount.mockResolvedValue(mockResponse);

      const result = await controller.calculateAmount(1000, 'compra', mockUser);

      expect(service.calculateAmount).toHaveBeenCalledWith(
        1000,
        'compra',
        mockUser,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getExchangeHistory', () => {
    it('debería llamar a exchangeService.getExchangeHistory correctamente', async () => {
      // const mockResponse = { totalItems: 2 };
      const mockResponse = {
        pagination: {
          totalItems: 44,
          totalPages: 44,
          currentPage: 1,
          pageSize: 1,
        },
        data: [
          {
            id: '6906d4a4c249fb3b6d259327',
            tipo_de_cambio: 'compra',
            monto_enviar: 1,
            monto_recibir: 3.39,
            createdAt: new Date('2025-11-02T23:20:48.825Z'),
            tasa_de_cambio: {
              _id: '6903820d8c6dd7565a96cbbe',
              purchase_price: 3.39,
              sale_price: 0,
            },
            id_usuario: '6906d3bbc249fb3b6d259325',
            estadoSolicitud: 'pendiente',
          },
        ],
      };

      service.getExchangeHistory.mockResolvedValue(mockResponse);

      const result = await controller.getExchangeHistory(1, 10, mockUser);

      expect(service.getExchangeHistory).toHaveBeenCalledWith(1, 10, mockUser);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getExchangeHistoryDetail', () => {
    it('debería llamar a exchangeService.getExchangeHistoryDetail correctamente', async () => {
      const mockResponse = {
        id_usuario: 'user123',
        id: '123',
        tipo_de_cambio: 'venta',
        monto_enviar: 10,
        monto_recibir: 2.9,
        createdAt: new Date(),
        tasa_de_cambio: {
          _id: 'rate123',
          purchase_price: 0,
          sale_price: 3.433,
        },
        estadoSolicitud: 'pendiente',
      };

      service.getExchangeHistoryDetail.mockResolvedValue(mockResponse);

      const result = await controller.getExchangeHistoryDetail('123', mockUser);

      expect(service.getExchangeHistoryDetail).toHaveBeenCalledWith(
        '123',
        mockUser,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteExchangeHistory', () => {
    it('debería llamar a exchangeService.deleteExchangeHistory correctamente', async () => {
      const mockResponse = { success: true, message: 'ok' };
      service.deleteExchangeHistory.mockResolvedValue(mockResponse);

      const result = await controller.deleteExchangeHistory('123', mockUser);

      expect(service.deleteExchangeHistory).toHaveBeenCalledWith(
        '123',
        mockUser,
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
