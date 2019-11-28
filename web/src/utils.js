
export const getPathInfo = (path) => {
  const url = new URL(path, 'http://localhost')
  const { search, pathname, searchParams } = url

  // Ignore trailing slashes EXPEPT for home page
  const withoutTrailingSlash = pathname !== '/' ? pathname.replace(/\/$/, '') : pathname

  return {
    path: withoutTrailingSlash,
    query: search,
    queryParams: Object.fromEntries(searchParams.entries())
  }
}
