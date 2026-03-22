import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:latlong2/latlong.dart';

class EventModel {
  final String id;
  final String title;
  final String description;
  final LatLng location;
  final int attendeesCount;

  EventModel({
    required this.id,
    required this.title,
    required this.description,
    required this.location,
    required this.attendeesCount,
  });
}

// Mock provider until backend API is fully integrated
final eventsProvider = StateProvider<List<EventModel>>((ref) {
  return [
    EventModel(
      id: '1',
      title: 'Nairobi Tech Meetup',
      description: 'Discussing Flutter & NestJS',
      location: const LatLng(-1.2921, 36.8219),
      attendeesCount: 5,
    ),
    EventModel(
      id: '2',
      title: 'Coffee Tasting',
      description: 'Sampling the best Kenyan coffee',
      location: const LatLng(-1.2858, 36.8231),
      attendeesCount: 12,
    ),
  ];
});
