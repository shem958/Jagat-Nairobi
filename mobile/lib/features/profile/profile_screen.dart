import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Profile')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const CircleAvatar(
              radius: 50,
              backgroundColor: Colors.deepPurple,
              foregroundColor: Colors.white,
              child: Icon(Icons.person, size: 50),
            ),
            const SizedBox(height: 24),
            Text('Nairobi User', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            const Text('+254 7XX XXX XXX', style: TextStyle(color: Colors.grey)),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: () {
                // TODO: Sign out logic
                context.go('/login');
              },
              child: const Text('Log Out'),
            )
          ],
        ),
      ),
    );
  }
}
