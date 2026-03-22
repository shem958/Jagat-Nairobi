import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:latlong2/latlong.dart';
// import 'package:firebase_core/firebase_core.dart';
import 'features/map/map_screen.dart';
import 'features/events/create_event_screen.dart';
import 'features/events/event_detail_screen.dart';
import 'features/auth/login_screen.dart';
import 'features/profile/profile_screen.dart';
// import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // TODO: initialize firebase when flutterfire CLI creates firebase_options.dart
  // await Firebase.initializeApp(
  //   options: DefaultFirebaseOptions.currentPlatform,
  // );

  runApp(
    const ProviderScope(
      child: JagatApp(),
    ),
  );
}

final goRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/login',
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfileScreen(),
      ),
      GoRoute(
        path: '/map',
        builder: (context, state) => const MapScreen(),
      ),
      GoRoute(
        path: '/create-event',
        builder: (context, state) {
          final location = state.extra as LatLng?;
          return CreateEventScreen(
            initialLocation: location ?? const LatLng(-1.2921, 36.8219),
          );
        },
      ),
      GoRoute(
        path: '/event/:id',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return EventDetailScreen(eventId: id);
        },
      ),
    ],
  );
});

class JagatApp extends ConsumerWidget {
  const JagatApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(goRouterProvider);

    return MaterialApp.router(
      title: 'Jagat Nairobi',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}
