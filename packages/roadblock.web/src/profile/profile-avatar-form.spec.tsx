/* eslint-disable require-jsdoc */

import { act, fireEvent, render } from '@testing-library/react';
import { IZImageReader } from '@zthun/works.draw';
import { createMocked } from '@zthun/works.jest';
import { IZFileSelect, ZFileSelectContext, ZImageReaderContext } from '@zthun/works.react';
import React from 'react';
import { ZProfileAvatarForm } from './profile-avatar-form';

describe('ZProfileAvatarForm', () => {
  let file: File;
  let fileSelect: jest.Mocked<IZFileSelect>;
  let maxSize = Infinity;
  let imageReader: jest.Mocked<IZImageReader>;
  let avatar: string;
  let avatarChange: jest.Mock;
  let disabled: boolean;
  let loading: boolean;
  let avatarImage: HTMLCanvasElement;
  let horizontalOpenImage: HTMLCanvasElement;
  let verticalOpenImage: HTMLCanvasElement;

  async function createTestTarget() {
    return render(
      <ZImageReaderContext.Provider value={imageReader}>
        <ZFileSelectContext.Provider value={fileSelect}>
          <ZProfileAvatarForm avatar={avatar} maxSize={maxSize} onAvatarChange={avatarChange} disabled={disabled} loading={loading} />
        </ZFileSelectContext.Provider>
      </ZImageReaderContext.Provider>
    );
  }

  beforeEach(() => {
    file = new File([], 'test.png');

    fileSelect = createMocked<IZFileSelect>(['open']);
    fileSelect.open.mockImplementation((ac: string, cb: (file: File) => void) => cb(file));

    avatar = 'https://steamavatar.io/img/14777429602y3IT.jpg';
    avatarChange = jest.fn();

    avatarImage = document.createElement('canvas');
    avatarImage.width = 100;
    avatarImage.height = 200;
    avatarImage.getContext('2d').fillStyle = 'blue';
    avatarImage.getContext('2d').fillRect(0, 0, 256, 256);

    horizontalOpenImage = document.createElement('canvas');
    horizontalOpenImage.width = 500;
    horizontalOpenImage.height = 300;
    horizontalOpenImage.getContext('2d').fillStyle = 'green';
    horizontalOpenImage.getContext('2d').fillRect(0, 0, 500, 300);

    verticalOpenImage = document.createElement('canvas');
    verticalOpenImage.width = 300;
    verticalOpenImage.height = 500;
    verticalOpenImage.getContext('2d').fillStyle = 'red';
    verticalOpenImage.getContext('2d').fillRect(0, 0, 300, 500);

    imageReader = createMocked<IZImageReader>(['read']);
    imageReader.read.mockResolvedValue(avatarImage);
  });

  it('renders the form.', async () => {
    // Arrange
    const target = await createTestTarget();
    // Act
    const actual = target.getByTestId('ZProfileAvatarForm-root');
    // Assert
    expect(actual).toBeTruthy();
  });

  describe('Open', () => {
    it('should update the selected image.', async () => {
      // Arrange
      const target = await createTestTarget();
      imageReader.read.mockReset();
      imageReader.read.mockResolvedValue(horizontalOpenImage);
      // Act
      const btn = target.getByTestId('ZProfileAvatarForm-btn-open');
      const cvs = target.getByTestId('ZProfileAvatarForm-picture') as HTMLCanvasElement;
      jest.spyOn(cvs.getContext('2d'), 'drawImage');
      await act(async () => {
        fireEvent.click(btn);
      });
      // Assert
      expect(cvs.getContext('2d').drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0);
    });
  });

  describe('Fit', () => {
    it('should update the selected image.', async () => {
      // Arrange
      const target = await createTestTarget();
      // Act
      const btn = target.getByTestId('ZProfileAvatarForm-btn-open');
      const cvs = target.getByTestId('ZProfileAvatarForm-picture') as HTMLCanvasElement;
      jest.spyOn(cvs.getContext('2d'), 'drawImage');
      await act(async () => {
        fireEvent.click(btn);
      });
      await act(async () => {
        fireEvent.click(btn);
      });
      // Assert
      expect(cvs.getContext('2d').drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0);
    });
  });

  describe('Reset', () => {
    it('should update the selected image.', async () => {
      // Arrange
      const target = await createTestTarget();
      // Act
      const btn = target.getByTestId('ZProfileAvatarForm-btn-reset');
      const cvs = target.getByTestId('ZProfileAvatarForm-picture') as HTMLCanvasElement;
      jest.spyOn(cvs.getContext('2d'), 'drawImage');
      await act(async () => {
        fireEvent.click(btn);
      });
      await act(async () => {
        fireEvent.click(btn);
      });
      // Assert
      expect(cvs.getContext('2d').drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0);
    });
  });

  describe('Zoom', () => {
    async function assertSetsZoom(direction: number, id: string) {
      // Arrange
      const target = await createTestTarget();
      const expected = 100 + direction;
      // Act
      const zoom = target.getByTestId(`ZProfileAvatarForm-btn-${id}`);
      await act(async () => {
        fireEvent.click(zoom);
      });
      const actual = target.getByTestId('ZProfileAvatarForm-percent') as HTMLParagraphElement;
      // Assert
      expect(actual.textContent).toEqual(`${expected}%`);
    }

    it('should update the zoom percent by positive 10% on zoom in.', async () => {
      await assertSetsZoom(10, 'zoom-in');
    });

    it('should update the zoom percent by negative 10% on zoom out.', async () => {
      await assertSetsZoom(-10, 'zoom-out');
    });
  });

  describe('Save', () => {
    it('should invoke the onAvatarChange event when saving and valid.', async () => {
      // Arrange
      const target = await createTestTarget();
      // Act
      const button = target.getByText('Update Avatar');
      fireEvent.click(button);
      // Assert
      expect(avatarChange).toHaveBeenCalledWith(expect.any(String));
    });

    it('should show the max size error when the image is oversized.', async () => {
      // Arrange
      maxSize = 1;
      const target = await createTestTarget();
      // Act
      const button = target.getByText('Update Avatar');
      await act(async () => {
        fireEvent.click(button);
      });
      const actual = target.getByTestId('ZProfileAvatarForm-alert-oversized-true');
      // Assert
      expect(actual).toBeTruthy();
    });

    it('should close the oversize alert when the user clicks the x button.', async () => {
      // Arrange
      maxSize = 1;
      const target = await createTestTarget();
      // Act
      const button = target.getByText('Update Avatar');
      await act(async () => {
        fireEvent.click(button);
      });
      await act(async () => {
        const close = target.getByTestId('ZProfileAvatarForm-alert-oversized-close');
        fireEvent.click(close);
      });
      const actual = target.getByTestId('ZProfileAvatarForm-alert-oversized-false');
      // Assert
      expect(actual).toBeTruthy();
    });

    it('should invoke the onAvatarChange event when clearing.', async () => {
      // Arrange
      const target = await createTestTarget();
      // Act
      const button = target.getByText('Clear');
      fireEvent.click(button);
      // Assert
      expect(avatarChange).toHaveBeenCalledWith(null);
    });
  });
});
