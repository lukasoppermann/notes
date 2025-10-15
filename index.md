---
layout: default
title: Home
---

<style>
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 2em;
  margin: 2em 0;
}
.card {
  background: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 8px #0001;
  padding: 1.5em;
  min-width: 220px;
  min-height: 100px;
  text-align: center;
  flex: 1 0 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: box-shadow 0.2s;
}
.card:hover {
  box-shadow: 0 4px 16px #0002;
  background: #e8f5ff;
}
.card-title {
  font-size: 1.3em;
  font-weight: bold;
  margin-bottom: 0.5em;
}
.card-link {
  text-decoration: none;
  color: inherit;
  width: 100%;
  height: 100%;
  display: block;
}
</style>

# Welcome

Browse by topic:

<div class="cards">
{% assign nav = site.data.nav %}
{% for folder in nav %}
  {% if folder.children %}
    {% assign first = nil %}
    {% for child in folder.children %}
      {% if child.url %}
        {% assign first = child %}
        {% break %}
      {% endif %}
    {% endfor %}
    {% if first %}
      <a class="card-link" href="{{ first.url | uri_escape | relative_url }}">
        <div class="card">
          <div class="card-title">{{ folder.title }}</div>
          <div>{{ first.title | escape }}</div>
        </div>
      </a>
    {% endif %}
  {% endif %}
{% endfor %}
</div>
