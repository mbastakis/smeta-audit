import React from 'react';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import type { Document } from '../types/document';

/**
 * Get the display name for a document
 * Uses displayName if provided, otherwise original filename without extension
 */
export function getDisplayName(document: Document): string {
  if (document.displayName) {
    return document.displayName;
  }
  return removeFileExtension(document.originalFilename);
}

/**
 * Remove file extension from filename
 */
export function removeFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) return filename;
  return filename.substring(0, lastDotIndex);
}

/**
 * Extract file extension from filename
 */
export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) return '';
  return filename.substring(lastDotIndex + 1).toLowerCase();
}

/**
 * Get the appropriate file type icon based on extension
 */
export function getFileTypeIcon(extension: string): React.ReactElement {
  const iconProps = { fontSize: 'small' as const };
  
  switch (extension.toLowerCase()) {
    case 'pdf':
      return React.createElement(PictureAsPdfIcon, { ...iconProps, sx: { color: '#d32f2f' } });
    case 'doc':
    case 'docx':
      return React.createElement(DescriptionIcon, { ...iconProps, sx: { color: '#1976d2' } });
    case 'xls':
    case 'xlsx':
      return React.createElement(TableChartIcon, { ...iconProps, sx: { color: '#388e3c' } });
    case 'jpg':
    case 'jpeg':
    case 'png':
      return React.createElement(ImageIcon, { ...iconProps, sx: { color: '#7b1fa2' } });
    default:
      return React.createElement(InsertDriveFileIcon, iconProps);
  }
}

/**
 * Get file type icon from a document object
 */
export function getDocumentIcon(document: Document): React.ReactElement {
  const extension = getFileExtension(document.originalFilename);
  return getFileTypeIcon(extension);
}
