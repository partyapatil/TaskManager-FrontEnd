import { Avatar } from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import addIcon from "../../../../assets/icons/addIcon.svg";
import adminIcon from "../../../../assets/icons/adminIcon.svg";
import collaboration from "../../../../assets/icons/collaboration.svg";
import search from "../../../../assets/icons/search.svg";
import CreateProject from "../../../../components/DashBoardProject/CreateProject";
import {
  ProjectTypeEnum,
  SortProject,
} from "../../../../constants/applicationEnum";
import {
  getNameInitials,
  stringToColour,
} from "../../../../constants/functions";
import {
  getProjects,
  getSearchedProjects,
  getSortedProjects,
} from "./ProjectsSlice/ProjectSlice";
import TrialModal from "../../ProjectHomeScreen/UserInvitation/ProjectSettings/TrialModal";
import { set } from "lodash";
import { setprojectvar } from "../../ProjectHomeScreen/UserInvitation/UserInvitationSlice/UserInvitationSlice";
import { CustomTooltip } from "../../../../shared/overideStylesCss";
import { getProjectTypes } from "../../createProject/slice/createProjectSlice";
import "./ProjectCard.css";
import ProjectCardCss from "./ProjectCardCss";
import { baseApiCall } from "../../../../apiClient/baseApiCall";
import { URL } from "../../../../../public/config";
const ProjectCard = () => {
  const [showModal, setCloseModal] = React.useState(false);
  const createProjectState = useSelector(
    (state: any) => state.createProjectState
  );
  const getProjectState = useSelector((state: any) => state.getProjectsState);
  const dispatch = useDispatch();
  const classes = ProjectCardCss();
  const history = useHistory();

  const [filter, setFilter] = React.useState<any>(1);
  const [sort, setSort] = React.useState<any>(5);
  const [name, setName] = React.useState<any>();
  const [openTrialModal, setOpenTrialModal] = useState(false);
  const projectHomeState = useSelector((state: any) => state?.projectHomeState);
  const userRoleState = useSelector((state: any) => state?.userRoleState);
const reduxprojectvar = useSelector((state: any) => state?.projectvar);
  const loginState = useSelector((state: any) => state.loginState);
const [IsTrialActive, setIsTrialActive] = useState(false);
const[isSubscribedUser, setIsSubscribedUser] = useState(false);
const [SubData, setSubData] = useState<any>(null);
  
  const Projects = [
    {
      name: "All Projects",
      value: ProjectTypeEnum?.allProject,
    },

    {
      name: "My Projects",
      value: ProjectTypeEnum?.myProject,
    },
    {
      name: "Collaborative",
      value: ProjectTypeEnum?.collaborativeProject,
    },
  ];
  const sortProject = [
    {
      name: "Project Name",
      value: SortProject?.projectName,
    },
    {
      name: "Created On",
      value: SortProject?.projectDate,
    },

    {
      name: "Project Type",
      value: SortProject?.projectType,
    },

    {
      name: "Modified On",
      value: SortProject?.modifiedOn,
    },
  ];
  React.useEffect(() => {
    dispatch(getProjects(filter));
  }, [filter]);

  React.useEffect(() => {
    dispatch(
      getSortedProjects({
        sort: sort,
        filter: filter,
      })
    );
  }, [sort]);

  React.useEffect(() => {
    dispatch(
      getSortedProjects({
        sort: 5,
        filter: filter,
      })
    );
  }, []);

  React.useEffect(() => {
    dispatch(getProjectTypes());
  }, []);

  useEffect(() => {
    getUserDetails()
  }, []);
  
const getUserDetails = () => {
  if (!loginState?.userId) {
    //console.error("User ID is missing");
    return;
  }
 //console.log("Fetching user details for userId:", loginState.userId);
  const url = `${URL.userManagement.getSubscriptionByID}?userId=${loginState.userId}`;

  baseApiCall({
    url,
    method: "GET",
    contentType: "application/json", 
    onSuccess: (response) => {
      let res = response.data;

      setSubData(res);
      if (res?.isSubscriptionActive) {
        setIsSubscribedUser(true);
      }
      // Check if modal has been shown in this session
 //console.log("sessionStorage 'hasShownTrialModal':", sessionStorage.getItem('hasShownTrialModal'));

      // Only proceed if trial is active
      if (res?.isTrialPeriodActive) {
        // Check if modal was shown before (using sessionStorage)
        const hasShownModal = sessionStorage.getItem('hasShownTrialModal') === 'true';

        if (!hasShownModal) {
          //console.log("Showing trial modal (first time in this session)");
          setIsTrialActive(true);
          setOpenTrialModal(true);
          sessionStorage.setItem('hasShownTrialModal', 'true'); // Mark as shown
        } else {
          //console.log("Modal already shown in this session");
        }
      }
    },
    invalidCall: (response) => {
      //console.error("Invalid API response:", response);
    },
    errorCall: (error) => {
      //console.error("Error fetching user details:", error);
    }
  });
};




  const handleCloseTrialModal = () => {
    setOpenTrialModal(false);
  };

  const formatDate = (params: any) => {
    const date = new Date(params).toLocaleDateString("en-UK", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return date;
  };

  function camelToSnake(str: any) {
    return str?.replace(/[A-Z]/g, (c: any) => {
      return c?.toLowerCase();
    });
  }

  const handleOnProjectCardClick = (params: any, projectType: any) => {
    history.push({
      pathname: "/project/" + projectType + "/" + params?.id,
      state: {
        projectName: params?.name,
        clientName: "params?.client.name",
        projectId: params?.id,
      },
    });
  };

  const HandleOnSearchCLick = () => {
    dispatch(
      getSearchedProjects({
        name: name,
        filter: filter,
      })
    );
  };
let test=false;
  const ProjecttypeCheck = (data: any) => {
    let newProjectType: string | undefined;
    if (Array.isArray(createProjectState?.projectType)) {
      const matchingElement: any = createProjectState?.projectType?.find(
        (elem: any) => elem?.id === data?.projectTypeId
      );
      if (matchingElement) {
        newProjectType = camelToSnake(matchingElement?.name);
      }
    } else if (createProjectState?.projectType) {
      const matchingElement: any = Object.values(
        createProjectState?.projectType
      )?.find((elem: any) => elem?.id === data?.projectTypeId);
      if (matchingElement) {
        newProjectType = camelToSnake(matchingElement?.name);
      }
    }
    return newProjectType;
  };

  return (
    <div className="projectContainer">
      <div className="mainHeader">
        <div className="HeaderContainer">
          <div className="firsttDiv"></div>
          <div
            className="project-searchbar"
            onKeyPress={(event) => {
              if (event?.key === "Enter") {
                HandleOnSearchCLick();
              }
            }}
          >
            <input
              className="inputSearch"
              type="text"
              onChange={(e) => setName(e?.target?.value)}
              placeholder="Search"
            />
            <button className="searchButton" type="submit">
              <img
                src={search}
                alt="Search"
                onClick={() => HandleOnSearchCLick()}
              />
            </button>
          </div>
          <div className="thirdDiv"></div>
        </div>
        <div className="selectProject-container">
          <div>
            <select
              className="dropDown selectProjectType"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilter(e?.target?.value)
              }
            >
              {Projects?.map((data: any, index: number) => {
                return (
                  <option key={index} value={data?.value}>
                    {" "}
                    {data?.name}{" "}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <select
              defaultValue={"DEFAULT"}
              className="dropDown selectProjectType"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSort(e?.target?.value)
              }
            >
              <option disabled hidden value="DEFAULT">
                Sort By
              </option>
              {sortProject?.map((data: any, index: number) => {
                return (
                  <option key={index} value={data?.value}>
                    {" "}
                    {data?.name}{" "}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
      <div className="mainDiv1">
        <div className="projectCardRoot">
   {filter !== "3" && (
  <div className={`projectcard ${!isSubscribedUser ? 'disabled' : ''}`}>
    <div 
      className="addIcon-wrapper"
      onClick={() => isSubscribedUser && setCloseModal(true)}
      style={{ cursor: !isSubscribedUser ? 'not-allowed' : 'pointer' }}
    >
      <div className="addIcon">
        <img 
          src={addIcon} 
          alt="Add" 
          style={{ opacity: !isSubscribedUser ? 0.5 : 1 }} 
        />
        {!isSubscribedUser && (
          <div className="subscribe-tooltip">Please subscribe to create a project</div>
        )}
      </div>
    </div>
  </div>
)}

    {typeof getProjectState?.projects === "object" &&
      getProjectState?.projects?.map((data: any, id: number) => {
        const isEnabled = data.isProjectEnabled;
        return (
          <div
            key={id}
            className={`projectcard ${!isEnabled ? "disabled-card" : ""}`}
            onClick={() => {
              if (isEnabled) {
                handleOnProjectCardClick(data, ProjecttypeCheck(data));
              }
            }}
            style={{ 
              cursor: isEnabled ? "pointer" : "not-allowed",
              position: "relative"
            }}
          >
            {!isEnabled && (
              <div className="expired-tooltip">
                Project subscription has ended
              </div>
            )}
        
        <div className="cardHeaderContainer">
          <div className="cardHeader">
            <img
              className="projectLogo"
              src={`/assets/projectType/${ProjecttypeCheck(data)}.svg`}
              alt="logo"
            />
            <div className="projectTitle">
              <p>{data.name}</p>
              <span>{ProjecttypeCheck(data)}</span>
            </div>
          </div>
          {data?.isProjectLead ? (
            <img
              src={adminIcon}
              alt="admin"
              className={classes.isAdminIcon}
            />
          ) : (
            <img
              src={collaboration}
              alt="admin"
              className={classes.isCollIcon}
            />
          )}
        </div>
        
{data?.projectAdminName && (
  <div style={{ marginTop: '6px' }}>
    <div style={{ 
      fontSize: '11px',
      color: '#A5A5A5',
      lineHeight: '1.2',
      marginTop:"0.9rem"
    }}>
      Admin
    </div>
    <div style={{
      fontSize: '13px',
      color: '#555',
      fontWeight: 500,
      lineHeight: '1.4',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }}>
      {data.projectAdminName}
    </div>
  </div>
)}
                <div className="avatar">
                  
                  <div className="UpdatedDate">
                    <p>
                      Created On <br></br>
                      <span>
                        {formatDate(data?.createdOn)?.includes("am")
                          ? formatDate(data?.createdOn).replace("am", "AM")
                          : formatDate(data?.createdOn)?.replace("pm", "PM")}
                      </span>{" "}
                    </p>
                  </div>

                  <AvatarGroup
                    max={4}
                    className={classes.avatar}
                    classes={{
                      avatar: classes.avatarText,
                    }}
                  >
                    {data?.projectUserNames?.map((data: any, id: number) => {
                      return (
                        <CustomTooltip key={id} title={data?.trim()}>
                          <Avatar
                            style={{
                              backgroundColor: stringToColour(
                                data?.trim() + "1002"
                              ),
                              width: "32px",
                              height: "32px",
                              fontSize: "12px",
                              fontFamily: "var(--roboto)",
                            }}
                            className={classes.userInitials}
                          >
                            {getNameInitials(data?.trim())}
                          </Avatar>
                        </CustomTooltip>
                      );
                    })}
                  </AvatarGroup>
                </div>
              </div>
          );
        })}

          <CreateProject
            showModal={showModal}
            title="New Project"
            handleCloseModal={setCloseModal}
          />


      <TrialModal 
            isOpen={openTrialModal} 
            onClose={handleCloseTrialModal} 
            SubData={SubData}
          />

        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
