import { describe, it, expect } from 'vitest';
import { intakeImages } from './kudos-compose-draft';

describe('intakeImages', () => {
  it('accepts valid image types (TC ID-21/22)', () => {
    const jpegFile = new File([], 'test.jpg', { type: 'image/jpeg' });
    const pngFile = new File([], 'test.png', { type: 'image/png' });
    const gifFile = new File([], 'test.gif', { type: 'image/gif' });
    const webpFile = new File([], 'test.webp', { type: 'image/webp' });

    const result = intakeImages([jpegFile, pngFile, gifFile, webpFile], 0);
    expect(result.accepted.length).toBe(4);
    expect(result.error).toBeUndefined();
  });

  it('rejects PDF files with type error (TC ID-23)', () => {
    const pdfFile = new File([], 'test.pdf', { type: 'application/pdf' });
    const jpegFile = new File([], 'test.jpg', { type: 'image/jpeg' });

    const result = intakeImages([pdfFile, jpegFile], 0);
    expect(result.accepted).toEqual([jpegFile]);
    expect(result.error).toBe('type');
  });

  it('rejects MP4 files with type error (TC ID-24)', () => {
    const mp4File = new File([], 'test.mp4', { type: 'video/mp4' });
    const jpegFile = new File([], 'test.jpg', { type: 'image/jpeg' });

    const result = intakeImages([mp4File, jpegFile], 0);
    expect(result.accepted).toEqual([jpegFile]);
    expect(result.error).toBe('type');
  });

  it('rejects TXT files with type error (TC ID-55)', () => {
    const txtFile = new File([], 'test.txt', { type: 'text/plain' });
    const jpegFile = new File([], 'test.jpg', { type: 'image/jpeg' });

    const result = intakeImages([txtFile, jpegFile], 0);
    expect(result.accepted).toEqual([jpegFile]);
    expect(result.error).toBe('type');
  });

  it('truncates to remaining slots out of 5', () => {
    const images = Array.from({ length: 3 }, (_, i) =>
      new File([], `img-${i}.jpg`, { type: 'image/jpeg' })
    );
    const result = intakeImages(images, 3); // 3 existing, 2 slots left
    expect(result.accepted.length).toBe(2);
    expect(result.error).toBe('max');
  });

  it('reports max error on overflow', () => {
    const images = Array.from({ length: 3 }, (_, i) =>
      new File([], `img-${i}.jpg`, { type: 'image/jpeg' })
    );
    const result = intakeImages(images, 4); // 4 existing, 1 slot left
    expect(result.accepted.length).toBe(1);
    expect(result.error).toBe('max');
  });

  it('accepts all when room available', () => {
    const images = Array.from({ length: 2 }, (_, i) =>
      new File([], `img-${i}.jpg`, { type: 'image/jpeg' })
    );
    const result = intakeImages(images, 0); // 0 existing, 5 slots available
    expect(result.accepted.length).toBe(2);
    expect(result.error).toBeUndefined();
  });

  it('handles empty file list', () => {
    const result = intakeImages([], 0);
    expect(result.accepted).toEqual([]);
    expect(result.error).toBeUndefined();
  });

  it('handles exactly full slots', () => {
    const images = Array.from({ length: 5 }, (_, i) =>
      new File([], `img-${i}.jpg`, { type: 'image/jpeg' })
    );
    const result = intakeImages(images, 0);
    expect(result.accepted.length).toBe(5);
    expect(result.error).toBeUndefined();
  });

  it('type error takes precedence over max error', () => {
    const pdfFile = new File([], 'test.pdf', { type: 'application/pdf' });
    const images = Array.from({ length: 5 }, (_, i) =>
      new File([], `img-${i}.jpg`, { type: 'image/jpeg' })
    );
    const allFiles = [pdfFile, ...images];
    const result = intakeImages(allFiles, 4); // 4 existing + 1 slot, but type error
    expect(result.error).toBe('type'); // type error not max error
  });
});
