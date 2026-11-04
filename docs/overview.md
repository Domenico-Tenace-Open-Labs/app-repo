# 1. Project Overview

A web app for discovering and sharing tools among developers. Registered users can add tools, browse those shared by others, star them, and find them again in their own bookmarks.

> From: section 1 of the original App Repo spec.

The project is a web platform for sharing tools that requires account registration. After registering, a user can not only browse a list of tools shared by other users, but also add, edit, and delete their own tools. Each tool has a name, a short description, and a pricing model (free, paid, subscription, etc.). Users can also rate other users' tools with a star, and those tools are then added to their bookmarks.

## Main features

- Registration and login (email/password and Google)
- Public list of tools with filters
- Add, edit, and delete your own tools
- Star voting (one star per user per tool)
- Personal bookmarks

## User roles

| Role | Permissions |
| --- | --- |
| Guest | Browse the tool list and details |
| Authenticated user | Everything above, plus add/edit/delete their own tools and star voting |