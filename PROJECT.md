# Stone Tamga

## Project Overview

Stone Tamga is a digital cultural heritage platform designed to preserve,
popularize, and make the cultural heritage of Kyrgyzstan more accessible.

The project focuses on three major areas:

1. Sacred places of Kyrgyzstan
2. Petroglyphs and ancient rock art
3. The traditional Kyrgyz calendar

The main idea is simple:

> We do not want to force people to study history.
> We want history and culture to naturally find them through travel,
> creativity, technology, and games.

Stone Tamga is designed as an ecosystem consisting of:

- Web platform
- Mobile application
- Roblox game

Each product targets a different context and audience while contributing
to the same mission.

# 1. Problem

Kyrgyzstan has a unique cultural heritage: sacred places, ancient
petroglyphs, traditional knowledge, and the Kyrgyz calendar.

However, most people know very little about it.

The problem is not simply that information does not exist.

Information can be found in research, books, museums, archives, and
cultural organizations, but most people will not actively search for it.

Cultural heritage is rarely integrated into people's everyday digital
experience.

As a result:

- Young people rarely interact with traditional knowledge.
- Many people do not know about cultural sites near them.
- Tourists may visit Kyrgyzstan without discovering important cultural
  locations.
- Knowledge about traditional practices can gradually disappear.
- Cultural information is often presented in formats that are difficult
  or unattractive for a general audience.

A person cannot value something if they do not know that it exists.

# 2. Mission

Make Kyrgyz cultural heritage:

- visible;
- accessible;
- understandable;
- interactive;
- interesting;
- useful in everyday life.

Instead of expecting users to search for culture, Stone Tamga introduces
culture naturally through experiences they already enjoy.

For example:

- travelling;
- exploring maps;
- playing games;
- creating art;
- taking quizzes;
- using a mobile phone;
- discovering places nearby.

# 3. Target Audience

Stone Tamga is designed for several audiences.

## Local Residents

People living in Kyrgyzstan who want to discover cultural heritage near
their cities, villages, or travel routes.

## Young People and Students

Users who may not normally read historical books or research but can
become interested through interactive experiences.

## Children

Children are one of the most important audiences.

Instead of teaching cultural heritage only through text and lectures,
Stone Tamga introduces it through games and visual experiences,
especially through Roblox.

## Families

Families travelling around Kyrgyzstan can discover cultural locations
along their normal routes.

## Tourists

International tourists can use the platform as an accessible cultural
guide to locations they might otherwise never discover.

## Researchers and Cultural Organizations

The platform can eventually support organizations, museums, researchers,
and cultural heritage initiatives by providing structured digital
information and community contributions.

# 4. Stone Tamga Ecosystem

The ecosystem consists of three connected products.

## 4.1 Web Platform

The website is the central knowledge and exploration platform.

It contains:

- cultural information;
- interactive maps;
- sacred places;
- petroglyph locations;
- traditional calendar;
- educational experiences;
- creative tools;
- community features.

Other parts of the ecosystem can direct users back to the website for
deeper exploration.

## 4.2 Mobile Application

The mobile application connects cultural heritage with the physical
world.

Its main purpose is contextual discovery.

Instead of requiring users to search for information manually, the app
can provide information when it becomes relevant.

## 4.3 Roblox Game

The Roblox game is primarily designed for children and younger
audiences.

Cultural knowledge is integrated directly into gameplay.

Players interact with environments, petroglyphs, artifacts, stories,
and cultural locations rather than learning only through text.

# 5. Website

The website should feel like a modern digital museum rather than a
traditional encyclopedia.

The user should feel like they are exploring Kyrgyzstan and discovering
its history.

# 6. Interactive Cultural Map

One of the main website features is an interactive map of Kyrgyzstan.

Technology:

- Leaflet
- React
- Geographic markers and zones

## Map Content

The map can display:

- Sacred places
- Petroglyph complexes
- Cultural locations
- User discoveries

## Location Information

Selecting a location should provide information such as:

- Name
- Photos
- Description
- History
- Cultural significance
- Location
- Visiting information
- Rules of respectful behavior
- Related stories or traditions

# 7. Sacred Places

Sacred places are one of the three main themes of the project.

The platform should help users understand:

- why a location is considered sacred;
- its historical and cultural significance;
- traditions connected to the location;
- appropriate behavior;
- actions that should be avoided.

## Protection and Respect

The project should encourage respectful cultural tourism.

Information should clearly explain:

- do not litter;
- respect local traditions;
- respect nature;
- follow appropriate clothing or behavior recommendations when
  relevant;
- avoid damaging cultural objects.

# 8. Geofencing

The mobile application can detect when users approach cultural
locations.

## Sacred Place Zone

When entering a protected area, the user can receive:

- phone vibration;
- notification;
- location name;
- short cultural explanation;
- behavior recommendations.

## Petroglyph Zone

When approaching petroglyphs, users can receive:

- notification;
- information about the site;
- invitation to explore the petroglyphs;
- educational content.

# 9. Cultural Route Planner

Users select:

- Point A
- Point B

Normally navigation systems optimize only for travel time.

Stone Tamga can provide an optional:

> Cultural Route

The system suggests nearby:

- sacred places;
- petroglyphs;
- cultural landmarks

along the user's journey.

For example:

A user travelling to visit relatives in another village could transform
an ordinary drive into a small cultural journey.

Before visiting locations, users receive short information about:

- what the location is;
- why it matters;
- how to behave;
- what they can discover there.

# 10. Petroglyphs

Petroglyphs are another major part of Stone Tamga.

Users should be able to:

- discover petroglyph complexes;
- view photographs;
- learn their possible meanings;
- understand their historical context;
- locate them on the map;
- interact with petroglyph-inspired experiences.

# 11. Petroglyph Scanner

Stone Tamga includes an experimental scanner.

Concept:

1. User finds a petroglyph.
2. User opens the scanner.
3. User photographs the rock.
4. The system analyzes the image.
5. The system displays relevant information.

Possible detection categories could include:

- animals;
- hunting scenes;
- human figures;
- geometric symbols;
- solar symbols.

## MVP Limitation

The current scanner may use simulated/mock analysis.

It must NOT be presented as a fully functional AI identification system
unless an actual computer vision model has been integrated.

Future versions could use computer vision models trained using verified
petroglyph datasets.

# 12. Community Discoveries

Users can submit possible cultural discoveries.

Submission can include:

- photograph;
- coordinates;
- description;
- date;
- optional comments.

## Moderation

New submissions should NOT automatically become verified cultural
locations.

Status:

- Pending
- Approved
- Rejected

Administrators or experts should review submissions before they appear
as verified locations.

# 13. Stone Workshop

Stone Workshop is a creative experience inspired by ancient rock
engraving.

Instead of normal digital drawing, users simulate carving into stone.

## Mechanics

Users can:

- select carving tool size;
- carve lines into a stone surface;
- create petroglyph-inspired drawings;
- submit their artwork.

## Important Design Rule

The drawing experience should intentionally have limitations inspired
by working with stone.

For example:

- limited tools;
- no normal digital brush;
- potentially no traditional erase function;
- carving sound and visual feedback.

The goal is not historical simulation accuracy.

The goal is to help users understand that creating rock art required
physical effort and deliberate decisions.

# 14. Community Gallery

Stone Workshop creations can be published to a community gallery.

Users can:

- explore artwork;
- vote;
- like;
- share;
- discover creators.

# 15. Leaderboard

Popular works can appear on a leaderboard.

Possible ranking signals:

- community votes;
- likes;
- expert selection;
- challenges.

## Future Idea

If Stone Workshop becomes popular, selected digital works could be
connected with real artists or craftspeople.

A digital design could potentially become a real physical artwork or
souvenir.

This connects digital creativity with real cultural practice.

# 16. Petroglyph Personality Quiz

A lightweight entertainment feature:

> "Which Petroglyph Are You?"

Users answer several questions.

The system matches them with a petroglyph-inspired archetype.

Possible examples:

- Argali
- Hunter
- Shepherd
- Solar Symbol
- Ancient Structure

The result can contain:

- archetype;
- personality description;
- cultural explanation;
- recommended real location to explore.

The primary purpose is discovery and engagement, not scientific
personality analysis.

# 17. Traditional Kyrgyz Calendar

The traditional Kyrgyz calendar is the third major focus of the
hackathon project.

This section should explain traditional understandings of:

- time;
- seasons;
- astronomy;
- nature;
- nomadic life.

## Topics

Potential concepts include:

- Үркөр
- Тогоол
- Токсон
- Кыш чилде
- Жай чилде
- Seasonal cycles
- Moon observations
- Traditional month names

# 18. Multiple Calendar Interpretations

An important part of the calendar section is that traditional calendar
knowledge may have different interpretations and reconstructions.

Two sources/persons currently being considered are:

- Төрөң Жумаев
- Дастан Сарыгулов

The platform should NOT invent differences between these systems.

Instead, the interface should eventually allow users to compare
verified information from primary or reliable sources.

## Proposed Interface

Possible modes:

- Жумаев
- Сарыгулов
- Compare

The comparison could show:

- similarities;
- differences;
- terminology;
- astronomical interpretation;
- seasonal interpretation;
- calculation methods;
- source references.

## Accuracy Requirement

All calendar claims must be based on reliable sources.

Unknown information should be marked as unknown rather than invented.

Dates of astronomical events must not be generated arbitrarily.

# 19. Roblox Game

Roblox is the main approach for reaching children.

The philosophy is:

> Do not make children read about heritage.
> Let them experience it.

## Game Concept

Working concept:

**Petroglyph Guardians**

Genre:

- Adventure
- Exploration
- Collection
- Cooperative survival
- Educational game

## Players

Approximately:

1–10 players

Solo gameplay should also be possible.

# 20. Roblox World

Possible environments include:

- Kyrgyz mountains;
- steppe;
- valleys;
- petroglyph locations;
- museum/base.

# 21. Core Gameplay Loop

## Day

During the day players:

1. Enter a biome.
2. Receive missions.
3. Explore the environment.
4. Search for petroglyphs.
5. Document or copy them.
6. Bring discoveries back to the museum.
7. Expand their collection.
8. Earn rewards.

## Night

At night the gameplay can become more challenging.

Possible mechanics:

- spirits appear;
- cultural objects require protection;
- players repair damage;
- players protect discovered locations;
- rare rewards become available.

The fantasy elements must be clearly separated from historical facts.

# 22. Museum System

Players build a collection inside the game museum.

Petroglyph discoveries become collectible exhibits.

Possible progression:

- museum upgrades;
- new exhibition areas;
- passive income;
- collection completion;
- educational descriptions.

# 23. Chüko / Reward System

A randomized reward mechanic can provide:

- collectible objects;
- cosmetic items;
- museum decorations;
- rare discoveries.

The system should be designed primarily around engagement and
collection, especially for younger audiences.

Avoid manipulative monetization patterns.

# 24. Educational Philosophy

The Roblox game should not feel like a school lesson.

Cultural information should appear naturally through:

- exploration;
- visual recognition;
- environment;
- quests;
- collection;
- storytelling.

A child does not need to memorize everything immediately.

The first objective is familiarity.

If children repeatedly see Kyrgyz petroglyphs, landscapes, stories,
and symbols while playing, these elements become recognizable.

Later, encountering them in real life can trigger curiosity and
recognition.

# 25. Mobile Application

The mobile application should be simple and location-oriented.

Possible technology:

- React Native
- Expo
- Expo Router

## Features

- Map
- User location
- Cultural locations
- Geofencing
- Haptic feedback
- Notifications
- Cultural routes
- Location details
- Multilingual support

# 26. Languages

The platform should support:

- Кыргызча
- Русский
- English

Language selection should be easily accessible.

Content should not rely only on automatic translation when dealing
with culturally sensitive or historically important terminology.

# 27. Technology Stack

## Web

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Leaflet
- Context API

## Mobile

- React Native
- Expo
- Expo Router

## Game

- Roblox Studio
- Luau

# 28. Design Direction

The visual direction is:

> Immersive Cultural Storytelling

## Design Mix

Approximately:

- 50% immersive digital museum
- 30% modern Kyrgyz cultural identity
- 20% gamification

## Visual Characteristics

Use:

- large cultural photography;
- Kyrgyz landscapes;
- stone textures;
- petroglyph imagery;
- traditional patterns;
- strong editorial typography;
- warm natural colors;
- cinematic layouts;
- subtle animation;
- generous whitespace;
- interactive storytelling.

## Avoid

Avoid making the whole website look like:

- esports dashboard;
- crypto website;
- generic SaaS landing page;
- fantasy RPG;
- cyberpunk interface.

Gaming elements should mainly appear inside interactive experiences.

# 29. Design References

Useful references:

- Google Arts & Culture
- Smithsonian Searchable Museum
- National Museum of Qatar
- The Metropolitan Museum of Art

These are references for interaction, storytelling, hierarchy, and
presentation.

Stone Tamga should still develop its own Kyrgyz visual identity rather
than copying these websites.

# 30. Homepage Direction

The homepage should immediately communicate:

**Kyrgyzstan + Heritage + Exploration**

Suggested hero:

- cinematic Kyrgyz landscape;
- authentic petroglyph imagery;
- strong headline;
- minimal navigation;
- subtle animated cultural elements.

Possible message:

> Discover the stories carved into Kyrgyzstan.

The homepage should lead users toward three major themes:

1. Sacred Places
2. Petroglyphs
3. Traditional Calendar

# 31. Calendar Design

The calendar section can use a visual language inspired by:

- sky;
- Moon;
- stars;
- Үркөр;
- seasonal landscapes;
- traditional observations.

It should feel educational and exploratory rather than like a normal
Google Calendar interface.

# 32. Map Design

The map should prioritize usability.

Users must clearly understand:

- where they are;
- what locations exist;
- location category;
- how to open details;
- how to build routes.

Visual beauty should not make navigation difficult.

# 33. Accessibility and Responsive Design

The website must work on:

- Desktop
- Tablet
- Mobile

Important requirements:

- readable text;
- sufficient contrast;
- keyboard-accessible controls where practical;
- accessible buttons;
- responsive navigation;
- reduced-motion support for major animations.

# 34. Cultural Accuracy

This is a critical project rule.

Do NOT invent:

- sacred locations;
- coordinates;
- petroglyph sites;
- historical stories;
- calendar dates;
- traditions;
- quotations;
- archaeological interpretations.

If information is uncertain:

- mark it as approximate;
- mark it as unverified;
- or do not display it.

User-submitted locations must be separated from verified locations.

# 35. Data Sources

Known source/reference currently used or considered:

## Rock Art Central Asia

Petroglyph and rock-art information:

https://rockartcentralasia.com/ru/complexes

## Aigine Cultural Research Center

Materials from Aigine are important sources for the cultural heritage
and traditional calendar sections.

YouTube:

https://youtube.com/@aiginecrc

Additional official/research materials should be preferred whenever
available.

# 36. MVP Philosophy

This is a hackathon project.

Do not attempt to build every possible feature perfectly.

Priority should be:

1. Strong core concept
2. Working demonstration
3. Clear user experience
4. Cultural accuracy
5. Attractive presentation
6. Demonstrable innovation

Features that are not fully implemented should be clearly presented as
prototypes.

# 37. Success Criteria

The project succeeds if users:

- discover cultural locations they did not previously know;
- understand why those places matter;
- learn something about traditional Kyrgyz knowledge;
- become interested enough to explore further;
- behave more respectfully at cultural locations;
- recognize Kyrgyz cultural symbols;
- share discoveries with other people.

# 38. Long-Term Vision

Stone Tamga could eventually become a digital infrastructure for
discovering Kyrgyz cultural heritage.

Potential future development:

- verified national cultural database;
- expert moderation;
- AI petroglyph recognition;
- real navigation;
- museum partnerships;
- school partnerships;
- tourism integration;
- cultural challenges;
- augmented reality;
- community documentation;
- physical exhibitions;
- research collaboration.

# 39. Core Product Principle

Every major feature should answer at least one of these questions:

1. Does this help someone discover Kyrgyz culture?
2. Does this help someone understand Kyrgyz culture?
3. Does this help preserve cultural knowledge?
4. Does this encourage respectful interaction with heritage?

If a feature does none of these, reconsider whether Stone Tamga needs it.

# 40. Core Message

Stone Tamga does not force people to study history.

It creates opportunities for history to find them:

- on the road;
- on a map;
- through art;
- through exploration;
- through games.

Different people connect with culture in different ways.

Stone Tamga gives each of them an entry point.

Because discovering that something valuable exists is the first step
toward caring about it.
