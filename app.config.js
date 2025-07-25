export default {
  expo: {
    name: "Tempest",
    slug: "Tempest",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "tempest",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    extra: {
      eas: {
        projectId: "a75c4d5d-38ac-4769-b938-798bc0c2038b"
      },
    },
    ios: {
      supportsTablet: true,
      splash: {
        image: "./assets/splash.png",
        imageWidth: 2048,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        googleServicesFile: "./GoogleService-Info.plist"
      },
      bundleIdentifier: "muktharamesh.Tempest",
      iosPlist: {
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    android: {
      useNextNotificationsApi: true,
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "muktharamesh.Tempest",
      googleServicesFile: "./google-services.json"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/icon.png"
    },
    plugins: [
      "expo-router",
      "expo-notifications",
      [
        "expo-splash-screen",
        {
          image: "./assets/splash.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    }
  }
};
