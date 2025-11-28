import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Supported video file extensions
const VIDEO_EXTENSIONS = ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.mpg', '.mpeg']

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // Load Vite in dev mode
  if (!app.isPackaged) {
    win.loadURL('http://localhost:5173/')
    // Open DevTools in development
    // win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'))
  }

  return win
}

// Get movie metadata from filename
function parseMovieFileName(filename) {
  // Remove extension
  const nameWithoutExt = path.parse(filename).name
  
  // Try to extract year (e.g., "Movie Name (2023)" or "Movie.Name.2023")
  const yearMatch = nameWithoutExt.match(/[\(\[]?(19|20)\d{2}[\)\]]?/)
  const year = yearMatch ? yearMatch[0].replace(/[\(\[\)\]]/g, '') : null
  
  // Try to extract quality (e.g., "1080p", "720p", "4K")
  const qualityMatch = nameWithoutExt.match(/\b(4K|2160p|1080p|720p|480p)\b/i)
  const quality = qualityMatch ? qualityMatch[0].toUpperCase() : null
  
  // Clean up title
  let title = nameWithoutExt
  if (yearMatch) {
    title = title.substring(0, yearMatch.index).trim()
  }
  
  // Replace dots and underscores with spaces
  title = title.replace(/[._]/g, ' ')
  // Remove quality tags
  title = title.replace(/\b(4K|2160p|1080p|720p|480p|BluRay|BRRip|WEBRip|HDTV|x264|x265|HEVC)\b/gi, '')
  // Clean up extra spaces
  title = title.replace(/\s+/g, ' ').trim()
  
  return { title, year, quality }
}

// Generate sample metadata (in production, you'd fetch from TMDB API or similar)
function generateSampleMetadata(title, year) {
  const genres = [
    ['Action', 'Thriller'],
    ['Drama', 'Romance'],
    ['Comedy', 'Family'],
    ['Sci-Fi', 'Adventure'],
    ['Horror', 'Thriller'],
    ['Animation', 'Family', 'Comedy']
  ]
  
  const descriptions = [
    'An epic tale of courage and adventure that takes you on an unforgettable journey through time and space.',
    'A heartwarming story about love, family, and the bonds that connect us all.',
    'Experience the thrill of a lifetime in this action-packed blockbuster that will keep you on the edge of your seat.',
    'A thought-provoking drama that explores the depths of human emotion and the choices that define us.',
    'Prepare for non-stop entertainment in this hilarious comedy that will leave you laughing from start to finish.',
    'Enter a world of wonder and imagination in this visually stunning masterpiece.'
  ]
  
  const randomIndex = Math.floor(Math.random() * genres.length)
  const duration = Math.floor(Math.random() * 60) + 90 // 90-150 minutes
  
  return {
    genres: genres[randomIndex],
    description: descriptions[randomIndex],
    duration,
    resolution: '1920x1080',
    codec: 'H.264'
  }
}

// Scan directory for movie files
async function scanMovieFolder(folderPath) {
  try {
    const files = await fs.readdir(folderPath)
    const movies = []
    
    for (const file of files) {
      const filePath = path.join(folderPath, file)
      const ext = path.extname(file).toLowerCase()
      
      if (VIDEO_EXTENSIONS.includes(ext)) {
        try {
          const stats = await fs.stat(filePath)
          const { title, year, quality } = parseMovieFileName(file)
          const metadata = generateSampleMetadata(title, year)
          
          movies.push({
            id: filePath,
            path: filePath,
            filename: file,
            title: title || file,
            year,
            quality,
            size: stats.size,
            addedDate: stats.birthtime,
            ext,
            ...metadata
          })
        } catch (error) {
          console.error(`Error reading file ${file}:`, error)
        }
      }
    }
    
    return movies
  } catch (error) {
    console.error('Error scanning folder:', error)
    throw error
  }
}

// IPC Handlers
ipcMain.handle('dialog:selectFolder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  
  if (result.canceled) {
    return { success: false, canceled: true }
  }
  
  const folderPath = result.filePaths[0]
  const movies = await scanMovieFolder(folderPath)
  
  return {
    success: true,
    path: folderPath,
    movies
  }
})

ipcMain.handle('movies:scan', async (event, folderPath) => {
  try {
    const movies = await scanMovieFolder(folderPath)
    return { success: true, movies }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('movie:play', async (event, moviePath) => {
  // You can implement video player here or use default system player
  const { shell } = await import('electron')
  await shell.openPath(moviePath)
  return { success: true }
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
