import { describe, it, expect } from 'vitest';
import {
  htmlToText,
  contentLength,
  normalizeHashtag,
  hasHashtag,
} from './kudos-compose-draft';

describe('htmlToText', () => {
  it('strips tags and leaves only text', () => {
    expect(htmlToText('<p>Hello</p>')).toBe('Hello');
    expect(htmlToText('<div>World</div>')).toBe('World');
  });

  it('converts <br> to newline', () => {
    expect(htmlToText('Line 1<br>Line 2')).toBe('Line 1\nLine 2');
    expect(htmlToText('Line 1<br/>Line 2')).toBe('Line 1\nLine 2');
  });

  it('converts closing block tags to newline', () => {
    expect(htmlToText('<p>A</p><p>B</p>')).toBe('A\nB');
    // Only closing tags create newlines; <li>Test</li> closes to newline then trims
    expect(htmlToText('Item<li>Test</li>')).toBe('ItemTest');
  });

  it('decodes HTML entities', () => {
    expect(htmlToText('&lt;script&gt;')).toBe('<script>');
    expect(htmlToText('&quot;quoted&quot;')).toBe('"quoted"');
    expect(htmlToText('&#39;apostrophe&#39;')).toBe("'apostrophe'");
    // &nbsp; converts to space but trim() removes leading whitespace
    expect(htmlToText('&nbsp;space')).toBe('space');
    expect(htmlToText('text&nbsp;space')).toBe('text space');
  });

  it('decodes double-encoded entities safely (amp last)', () => {
    // &amp;lt; should decode to &lt; not <
    expect(htmlToText('&amp;lt;script&amp;gt;')).toBe('&lt;script&gt;');
    expect(htmlToText('&amp;nbsp;')).toBe('&nbsp;');
  });

  it('treats empty contentEditable as empty', () => {
    // <p><br></p> is the untouched contentEditable value
    expect(htmlToText('<p><br></p>')).toBe('');
  });

  it('trims whitespace', () => {
    expect(htmlToText('  <p>text</p>  ')).toBe('text');
    expect(htmlToText('\n<div>content</div>\n')).toBe('content');
  });

  it('handles mixed content', () => {
    const html = '<p>Hello<br/>World</p><div>&amp; friends</div>';
    expect(htmlToText(html)).toBe('Hello\nWorld\n& friends');
  });
});

describe('contentLength', () => {
  it('returns text length after conversion', () => {
    expect(contentLength('<p>Hello</p>')).toBe(5);
  });

  it('counts newlines from converted tags', () => {
    expect(contentLength('<p>A</p><p>B</p>')).toBe(3); // "A\nB"
  });

  it('returns zero for empty HTML', () => {
    expect(contentLength('')).toBe(0);
    expect(contentLength('<p><br></p>')).toBe(0);
  });
});

describe('normalizeHashtag', () => {
  it('strips leading # characters', () => {
    expect(normalizeHashtag('#teamwork')).toBe('teamwork');
    expect(normalizeHashtag('##double')).toBe('double');
    expect(normalizeHashtag('###triple')).toBe('triple');
  });

  it('trims whitespace', () => {
    expect(normalizeHashtag('  teamwork  ')).toBe('teamwork');
    expect(normalizeHashtag('\t#tag\n')).toBe('tag');
  });

  it('handles already-normalized tags', () => {
    expect(normalizeHashtag('creativity')).toBe('creativity');
  });
});

describe('hasHashtag', () => {
  it('finds tags case-insensitively', () => {
    const tags = ['Teamwork', 'Dedicated'];
    expect(hasHashtag(tags, 'teamwork')).toBe(true);
    expect(hasHashtag(tags, 'TEAMWORK')).toBe(true);
    expect(hasHashtag(tags, 'Teamwork')).toBe(true);
  });

  it('returns false for missing tags', () => {
    const tags = ['Teamwork', 'Dedicated'];
    expect(hasHashtag(tags, 'Creativity')).toBe(false);
  });

  it('handles empty tag list', () => {
    expect(hasHashtag([], 'Teamwork')).toBe(false);
  });
});
