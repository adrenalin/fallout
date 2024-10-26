import { useState, useRef, useEffect } from 'react'
import './App.css';

function App() {
  const [rows, setRows] = useState(new Set())
  const [used, setUsed] = useState({})
  const addRow = useRef(null)
  const form = useRef(null)

  useEffect(() => {
    addRow.current.focus()
  })

  const handleAddRow = () => {
    const value = addRow.current.value.toUpperCase().replace(/[^A-Z ]+/, '')
    if (!value) {
      return false
    }

    setRows((prevRows) => {
      const values = new Set(prevRows)

      value.split(/[\n\r\s]+/).forEach((v) => {
        if (!v) {
          return
        }

        values.add(v)
      })

      addRow.current.value = ''
      return values
    })
  }

  const maxChars = Array.from(rows).reduce((acc, row) => Math.max(acc, row.length), 0)
  const headers = []

  for (let i = 0; i <= maxChars; i++) {
    headers.push(i)
  }

  const getLikeness = (v1, v2) => {
    let likeness = 0
    for (let i = 0; i < v1.length; i++) {
      if (v1[i] === v2[i]) {
        likeness++
      }
    }

    return likeness
  }

  const isExcluded = (value) => {
    for (const k in used) {
      if (getLikeness(k, value) === used[k]) {
        continue
      }

      return true
    }

    return false
  }

  return (
    <div id="codes" className='container'>
      <p>
        Start by entering the codes on the terminal. Either enter each one
        manually or separate by space.
      </p>
      <table>
        {!!rows.size && (
          <thead>
            <tr>
              <th>Code</th>
              <th className='value' colSpan={headers.length}>Likeness</th>
              <th className='btn'></th>
            </tr>
          </thead>
        )}
        <tbody>
          {Array.from(rows).map((row, i) => {
            return (
              <tr key={i} className={used[row] != null ? 'used' : 'unused'}>
                <td className='code'>
                  <code className={isExcluded(row) ? 'excluded' : 'possible'}>{row}</code>
                </td>
                {headers.map((h) => {
                  return (
                    (
                      <td key={h} className='value'>
                        <button
                          className={used[row] === h ? 'selected' : 'unselected'}
                          onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()

                            setUsed((prevUsed) => {
                              const values = {
                                ...prevUsed
                              }

                              if (h === values[row]) {
                                delete values[row]
                                return values
                              }

                              values[row] = h
                              return values
                            })
                          }}
                        >
                          {h}
                        </button>
                      </td>
                    )
                  )
                })}
                <td className='btn'>
                  <button
                    className='remove'
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()

                      setRows((prevRows) => {
                        const values = new Set(prevRows)
                        values.delete(row)
                        return values
                      })
                    }}
                  >
                    X
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={headers.length + 1}>
              <form
                ref={form}
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleAddRow()
                  return false
                }}
              >
                <input
                  type='text'
                  ref={addRow}
                  pattern='^[A-Z][A-Z ]+$'
                  onInput={(e) => {
                    e.target.value = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z ]/g, '')
                      .replace(/^ /, '')
                  }}
                  />
              </form>
            </th>
            <th className='btn'>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleAddRow()
                  return false
                }}
              >
                +
              </button>
            </th>
          </tr>
        </tfoot>
      </table>
      {!!rows.size && (
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setRows(() => new Set())
            setUsed(() => { return {} })
          }}
        >
          Clear
        </button>
      )}
    </div>
  );
}

export default App;
