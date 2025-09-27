import 'package:flutter/material.dart';

void main() {
  runApp(TravelApp());
}

class TravelApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Travel Explorer",
      theme: ThemeData(
        primarySwatch: Colors.deepOrange,
        scaffoldBackgroundColor: Colors.grey[100],
      ),
      home: DefaultTabController(
        length: 3,
        child: Scaffold(
          appBar: AppBar(
            backgroundColor: Colors.deepOrange,
            title: Text("Travel Explorer"),
            bottom: TabBar(
              indicatorColor: Colors.yellowAccent,
              labelColor: Colors.yellowAccent,
              unselectedLabelColor: Colors.white,
              tabs: [
                Tab(icon: Icon(Icons.location_on), text: "Destinations"),
                Tab(icon: Icon(Icons.hotel), text: "Hotels"),
                Tab(icon: Icon(Icons.flight_takeoff), text: "Bookings"),
              ],
            ),
          ),
          drawer: Drawer(
            child: Container(
              color: Colors.orange[50],
              child: ListView(
                padding: EdgeInsets.zero,
                children: [
                  DrawerHeader(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Colors.deepOrange, Colors.amber],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                    ),
                    child: Text(
                      "Welcome Explorer!",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  ListTile(
                    leading: Icon(Icons.favorite, color: Colors.deepOrange),
                    title: Text("Favourites"),
                    onTap: () {
                      Navigator.pop(context);
                    },
                  ),
                  ListTile(
                    leading: Icon(Icons.settings, color: Colors.deepOrange),
                    title: Text("Settings"),
                    onTap: () {
                      Navigator.pop(context);
                    },
                  ),
                  ListTile(
                    leading: Icon(Icons.help, color: Colors.deepOrange),
                    title: Text("Help & Support"),
                    onTap: () {
                      Navigator.pop(context);
                    },
                  ),
                ],
              ),
            ),
          ),
          body: TabBarView(
            children: [
              // Destinations Tab
              Container(
                color: Colors.lightBlue[50],
                padding: EdgeInsets.all(16),
                child: ListView(
                  children: [
                    Text(" Popular Destinations",
                        style: TextStyle(
                            fontSize: 22, fontWeight: FontWeight.bold)),
                    SizedBox(height: 12),
                    Card(
                      child: ListTile(
                        leading: Icon(Icons.beach_access, color: Colors.blue),
                        title: Text("Maldives"),
                        subtitle: Text("Crystal clear beaches & resorts"),
                      ),
                    ),
                    Card(
                      child: ListTile(
                        leading: Icon(Icons.park, color: Colors.green),
                        title: Text("Switzerland"),
                        subtitle: Text("Alps, lakes & beautiful scenery"),
                      ),
                    ),
                    Card(
                      child: ListTile(
                        leading: Icon(Icons.landscape, color: Colors.brown),
                        title: Text("Egypt"),
                        subtitle: Text("Pyramids & ancient history"),
                      ),
                    ),
                  ],
                ),
              ),

              // Hotels Tab
              Container(
                color: Colors.pink[50],
                padding: EdgeInsets.all(16),
                child: ListView(
                  children: [
                    Text("Recommended Hotels",
                        style: TextStyle(
                            fontSize: 22, fontWeight: FontWeight.bold)),
                    SizedBox(height: 12),
                    Card(
                      child: ListTile(
                        leading: Icon(Icons.hotel, color: Colors.deepOrange),
                        title: Text("Sunset Resort, Maldives"),
                        subtitle: Text("5-star luxury resort with sea view"),
                      ),
                    ),
                    Card(
                      child: ListTile(
                        leading: Icon(Icons.hotel, color: Colors.deepOrange),
                        title: Text("Alpine Lodge, Switzerland"),
                        subtitle: Text("Cozy stay near the mountains"),
                      ),
                    ),
                    Card(
                      child: ListTile(
                        leading: Icon(Icons.hotel, color: Colors.deepOrange),
                        title: Text("Nile View Hotel, Egypt"),
                        subtitle: Text("Modern comfort with river view"),
                      ),
                    ),
                  ],
                ),
              ),

              // Bookings Tab
              Container(
                color: Colors.green[50],
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("✈ My Bookings",
                        style: TextStyle(
                            fontSize: 22, fontWeight: FontWeight.bold)),
                    SizedBox(height: 20),
                    ListTile(
                      leading: Icon(Icons.flight, color: Colors.blue),
                      title: Text("Flight to Maldives"),
                      subtitle: Text("Date: 25 Oct 2025"),
                    ),
                    Divider(),
                    ListTile(
                      leading: Icon(Icons.hotel, color: Colors.deepOrange),
                      title: Text("Hotel Booking: Sunset Resort"),
                      subtitle: Text("Date: 25 Oct – 30 Oct 2025"),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
