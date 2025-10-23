import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:cached_network_image/cached_network_image.dart';

void main() {
  runApp(const AnimeWallpaperApp());
}

class AnimeWallpaperApp extends StatelessWidget {
  const AnimeWallpaperApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Anime Wallpapers',
      theme: ThemeData.dark(),
      home: const WallpaperScreen(),
    );
  }
}

class WallpaperScreen extends StatefulWidget {
  const WallpaperScreen({super.key});

  @override
  State<WallpaperScreen> createState() => _WallpaperScreenState();
}

class _WallpaperScreenState extends State<WallpaperScreen> {
  List<String> wallpapers = [];
  bool isLoading = true;
  bool isError = false;

  @override
  void initState() {
    super.initState();
    fetchWallpapers();
  }

  Future<void> fetchWallpapers() async {
    try {
      setState(() {
        isLoading = true;
        isError = false;
      });

      // ✅ Correct API URL with your key
      final url = Uri.parse(
        'https://wallhaven.cc/api/v1/search?q=anime&categories=111&purity=100&sorting=random&apikey=u5CYSjDEWSJZJ3TxHCQDkKa2v4YtfOoK',
      );
      final response = await http.get(url);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        List<String> urls = [];

        // ✅ Wallhaven returns images inside 'data' list, each with a 'path'
        if (data['data'] != null) {
          for (var item in data['data']) {
            if (item['path'] != null) {
              urls.add(item['path']);
            }
          }
        }

        setState(() {
          wallpapers = urls;
          isLoading = false;
        });
      } else {
        throw Exception('Failed to load wallpapers');
      }
    } catch (e) {
      setState(() {
        isError = true;
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (isError) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('Error loading wallpapers'),
              const SizedBox(height: 10),
              ElevatedButton(
                onPressed: fetchWallpapers,
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      );
    }

    if (wallpapers.isEmpty) {
      return const Scaffold(
        body: Center(child: Text('No wallpapers found')),
      );
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Anime Wallpapers')),
      body: RefreshIndicator(
        onRefresh: fetchWallpapers,
        child: GridView.builder(
          padding: const EdgeInsets.all(8.0),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 8,
            mainAxisSpacing: 8,
          ),
          itemCount: wallpapers.length,
          itemBuilder: (context, index) {
            return ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: CachedNetworkImage(
                imageUrl: wallpapers[index],
                placeholder: (context, url) =>
                const Center(child: CircularProgressIndicator()),
                errorWidget: (context, url, error) =>
                const Center(child: Icon(Icons.error)),
                fit: BoxFit.cover,
              ),
            );
          },
        ),
      ),
    );
  }
}
