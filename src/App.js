import { useState, useRef, useEffect } from 'react'
import './App.css';

function App() {
  const [rows, setRows] = useState(new Set(['foo', 'bar', 'faa', 'baa', 'bor']))
  const [used, setUsed] = useState({ foo: 1 })
  const addRow = useRef(null)
  const form = useRef(null)

  useEffect(() => {
    addRow.current.focus()
  })

  const handleAddRow = () => {
    const value = addRow.current.value
    if (!value) {
      return false
    }

    setRows((prevRows) => {
      const values = new Set(prevRows)
      values.add(value)
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
    const c1 = v1.split('')
    const c2 = v2.split('')

    c1.forEach((c) => {
      if (c2.includes(c)) {
        c2.splice(c2.indexOf(c), 1)
      }
    })

    return v1.length - c2.length
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
    <div id="codes">
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th className='value' colSpan={headers.length}>Likeness</th>
            <th className='btn'></th>
          </tr>
        </thead>
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
                add
              </button>
            </th>
          </tr>
        </tfoot>
      </table>
      <pre>{JSON.stringify(used, 2)}</pre>
    </div>
  );
}

export default App;
