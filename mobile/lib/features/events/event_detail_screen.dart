import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'events_provider.dart';

class EventDetailScreen extends ConsumerWidget {
  final String eventId;

  const EventDetailScreen({super.key, required this.eventId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final events = ref.watch(eventsProvider);
    final event = events.firstWhere(
      (e) => e.id == eventId,
      orElse: () => EventModel(
        id: '',
        title: 'Not Found',
        description: '',
        location: const latlong2.LatLng(0,0),
        attendeesCount: 0,
      ),
    );

    if (event.id.isEmpty) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: Text('Event not found')),
      );
    }

    return Scaffold(
      appBar: AppBar(title: Text(event.title)),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Attendees: ${event.attendeesCount}', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 16),
            Text(event.description, style: Theme.of(context).textTheme.bodyLarge),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  // TODO: Join event API call
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Joined event successfully!')),
                  );
                  context.pop();
                },
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  backgroundColor: Colors.deepPurple,
                  foregroundColor: Colors.white,
                ),
                child: const Text('Join Event'),
              ),
            )
          ],
        ),
      ),
    );
  }
}
