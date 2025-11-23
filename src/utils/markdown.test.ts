import { describe, it } from 'node:test';
import assert from 'node:assert';
import { postProcessHTML } from './markdown.ts';

describe('postProcessHTML', () => {
  it('should wrap tables in div.table-wrapper', () => {
    const input = '<table><tr><td>Cell</td></tr></table>';
    const expected = '<div class="table-wrapper"><table><tr><td>Cell</td></tr></table></div>';
    const result = postProcessHTML(input);
    assert.strictEqual(result, expected);
  });

  it('should wrap multiple tables in separate divs', () => {
    const input = '<table><tr><td>1</td></tr></table><p>Text</p><table><tr><td>2</td></tr></table>';
    const expected = '<div class="table-wrapper"><table><tr><td>1</td></tr></table></div><p>Text</p><div class="table-wrapper"><table><tr><td>2</td></tr></table></div>';
    const result = postProcessHTML(input);
    assert.strictEqual(result, expected);
  });

  it('should wrap standalone images in figure elements', () => {
    const input = '<p><img src="test.jpg" alt="Test"></p>';
    const expected = '<figure><img src="test.jpg" alt="Test"></figure>';
    const result = postProcessHTML(input);
    assert.strictEqual(result, expected);
  });

  it('should wrap multiple standalone images', () => {
    const input = '<p><img src="1.jpg"></p><p>Text</p><p><img src="2.jpg"></p>';
    const expected = '<figure><img src="1.jpg"></figure><p>Text</p><figure><img src="2.jpg"></figure>';
    const result = postProcessHTML(input);
    assert.strictEqual(result, expected);
  });

  it('should not wrap images that are not in paragraph tags', () => {
    const input = '<div><img src="test.jpg" alt="Test"></div>';
    const expected = '<div><img src="test.jpg" alt="Test"></div>';
    const result = postProcessHTML(input);
    assert.strictEqual(result, expected);
  });

  it('should handle complex HTML with both tables and images', () => {
    const input = '<h1>Title</h1><p><img src="test.jpg"></p><table><tr><td>Data</td></tr></table><p>Text</p>';
    const expected = '<h1>Title</h1><figure><img src="test.jpg"></figure><div class="table-wrapper"><table><tr><td>Data</td></tr></table></div><p>Text</p>';
    const result = postProcessHTML(input);
    assert.strictEqual(result, expected);
  });

  it('should preserve image attributes when wrapping', () => {
    const input = '<p><img src="test.jpg" alt="Test Image" class="responsive" width="100"></p>';
    const expected = '<figure><img src="test.jpg" alt="Test Image" class="responsive" width="100"></figure>';
    const result = postProcessHTML(input);
    assert.strictEqual(result, expected);
  });

  it('should handle nested tables correctly', () => {
    const input = '<table><tr><td><table><tr><td>Nested</td></tr></table></td></tr></table>';
    const expected = '<div class="table-wrapper"><table><tr><td><div class="table-wrapper"><table><tr><td>Nested</td></tr></table></div></td></tr></table></div>';
    const result = postProcessHTML(input);
    assert.strictEqual(result, expected);
  });

  it('should handle empty input', () => {
    const input = '';
    const expected = '';
    const result = postProcessHTML(input);
    assert.strictEqual(result, expected);
  });

  it('should handle HTML without tables or images', () => {
    const input = '<h1>Title</h1><p>Paragraph</p><ul><li>Item</li></ul>';
    const expected = '<h1>Title</h1><p>Paragraph</p><ul><li>Item</li></ul>';
    const result = postProcessHTML(input);
    assert.strictEqual(result, expected);
  });

  it('should handle paragraph with text and image', () => {
    const input = '<p>Some text with <img src="test.jpg"> inline image</p>';
    const expected = '<p>Some text with <img src="test.jpg"> inline image</p>';
    const result = postProcessHTML(input);
    assert.strictEqual(result, expected);
  });

  it('should only wrap images that are the sole content of a paragraph', () => {
    const input = '<p><img src="test.jpg"></p><p>Text and <img src="inline.jpg"> image</p>';
    const expected = '<figure><img src="test.jpg"></figure><p>Text and <img src="inline.jpg"> image</p>';
    const result = postProcessHTML(input);
    assert.strictEqual(result, expected);
  });

  it('should handle self-closing img tags', () => {
    const input = '<p><img src="test.jpg" /></p>';
    const expected = '<figure><img src="test.jpg" /></figure>';
    const result = postProcessHTML(input);
    assert.strictEqual(result, expected);
  });

  it('should handle tables with complex attributes', () => {
    const input = '<table class="data-table" id="table1"><tr><td>Cell</td></tr></table>';
    const expected = '<div class="table-wrapper"><table class="data-table" id="table1"><tr><td>Cell</td></tr></table></div>';
    const result = postProcessHTML(input);
    assert.strictEqual(result, expected);
  });

  it('should handle multiple transformations in realistic content', () => {
    const input = `
      <h1>Recipe</h1>
      <p>Here's a photo:</p>
      <p><img src="recipe.jpg" alt="Final dish"></p>
      <h2>Ingredients</h2>
      <table>
        <tr><td>Flour</td><td>2 cups</td></tr>
        <tr><td>Sugar</td><td>1 cup</td></tr>
      </table>
      <p>Mix together.</p>
      <p><img src="mixing.jpg" alt="Mixing"></p>
    `;
    const expected = `
      <h1>Recipe</h1>
      <p>Here's a photo:</p>
      <figure><img src="recipe.jpg" alt="Final dish"></figure>
      <h2>Ingredients</h2>
      <div class="table-wrapper"><table>
        <tr><td>Flour</td><td>2 cups</td></tr>
        <tr><td>Sugar</td><td>1 cup</td></tr>
      </table></div>
      <p>Mix together.</p>
      <figure><img src="mixing.jpg" alt="Mixing"></figure>
    `;
    const result = postProcessHTML(input);
    assert.strictEqual(result, expected);
  });
});
