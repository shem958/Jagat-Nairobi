import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getModelToken } from '@nestjs/mongoose';
import { Event } from './schemas/event.schema';

describe('EventsService', () => {
  let service: EventsService;

  const mockEventModel = {
    find: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getModelToken(Event.name),
          useValue: mockEventModel,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findNearbyEvents', () => {
    it('should query active events using $nearSphere', async () => {
      const mockEvents = [{ title: 'Test Event' }];
      mockEventModel.exec.mockResolvedValue(mockEvents);

      const result = await service.findNearbyEvents(-1.2921, 36.8219, 5000);

      expect(mockEventModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          expiresAt: { $gt: expect.any(Date) },
          location: {
            $nearSphere: {
              $geometry: {
                type: 'Point',
                coordinates: [36.8219, -1.2921], // [lng, lat]
              },
              $maxDistance: 5000,
            },
          },
        }),
      );
      expect(result).toEqual(mockEvents);
    });
  });
});
