import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import React, { useEffect, useState, useContext } from 'react'
import TimePeriodContext from '../context/TimePeriodContext'
import { getCohortsInfo, getUsersByTeacher } from '../api/apiCohort'
import NoStudents from '../components/NoStudents'
import CohortList from '../components/CohortList'
import StudentListTable from '../components/StudentListTable'
import '../assets/styles/pages/Home.scss'

const Home = () => {
  const [cohorts, setCohortsInfo] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [allStudents, setAllStudents] = useState([])
  const [refetchCohorts, setRefetchCohorts] = useState(0)

  const { timePeriod } = useContext(TimePeriodContext)

  useEffect(() => {
    getUsersByTeacher(timePeriod).then(students => {
      setAllStudents(students)
    })
  }, [timePeriod])

  useEffect(() => {
    getCohortsInfo().then(({ data }) => {
      setCohortsInfo(data)
    })
  }, [refetchCohorts])

  const handleChange = (event, value) => {
    setActiveTab(value)
  }
  return (
    <div className="page-home">
      <div className="page-home-content">
        <Tabs
          value={activeTab}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="secondary"
          style={{ marginBottom: '10px' }}
        >
          <Tab label="CLASSES" />
          <Tab label="STUDENTS" />
        </Tabs>
        {activeTab === 0 && (
          <CohortList refetch={setRefetchCohorts} cohorts={cohorts} />
        )}
        {activeTab === 1 &&
          (allStudents.length ? (
            <StudentListTable students={allStudents} />
          ) : (
            <NoStudents />
          ))}
      </div>
    </div>
  )
}

export default Home
