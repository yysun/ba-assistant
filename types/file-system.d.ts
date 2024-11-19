interface FileSystemPermissionDescriptor {
  mode?: 'read' | 'readwrite';
}

type FileSystemPermissionMode = 'read' | 'readwrite';

interface FileSystemHandle {
  readonly kind: 'file' | 'directory';
  readonly name: string;

  queryPermission(descriptor?: FileSystemPermissionDescriptor): Promise<PermissionState>;
  requestPermission(descriptor?: FileSystemPermissionDescriptor): Promise<PermissionState>;
}

interface FileSystemDirectoryHandle extends FileSystemHandle {
  readonly kind: 'directory';
}

interface Window {
  showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
}