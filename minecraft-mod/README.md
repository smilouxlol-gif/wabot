# Minecraft mod scaffold

This folder contains a minimal Forge 1.20.1 mod project for a custom item called `Limon`.

## What it does
- Adds an item named `Limon`
- When consumed, it grants Speed II for 10 seconds
- It is ready to be expanded with new blocks, tools, ores, and creatures

## Run it locally
1. Open the `minecraft-mod` folder in IntelliJ IDEA or VS Code.
2. Make sure Java 17 is installed.
3. Run Gradle tasks:
   - `./gradlew genIntellijRuns`
   - `./gradlew runClient`

## Files included
- `build.gradle`: Forge project setup
- `settings.gradle`: Gradle project name
- `src/main/java/...`: mod and item code
- `src/main/resources/...`: mod metadata and assets

## Note
The item texture file is intentionally omitted so the project stays simple and easy to extend. Add a `limon.png` texture under `src/main/resources/assets/miprimermod/textures/item/` if you want the item to render with a custom image.
