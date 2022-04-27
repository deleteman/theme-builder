import React, { useState, useEffect } from "react";
import styled from "styled-components";
import _ from 'lodash';
import {useTheme} from './theme/useTheme';
import { getFromLS, setToLS } from './utils/storage';
import { toBeInTheDOM } from "@testing-library/jest-dom";

import {generateRandomPopulation, breedPopulation, calculateDistances } from './utils/population'

const ThemedButton = styled.button`
    border: 0;
    display: inline-block;
    padding: 12px 24px;
    font-size: 14px;
    border-radius: 4px;
    margin-top: 5px;
    width: 100%;
    cursor: pointer;
`;

const Wrapper = styled.li`
    padding: 48px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid #000;
    list-style: none;
`;

const Container = styled.ul`
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(4, 1fr);
    margin-top: 3rem;
    padding: 10px;
`;

const Header = styled.h2`
    display: flex;
    justify-content: space-around;
`;

export default (props) => {
    const themesFromStore = getFromLS('all-themes');
    const [data, setData] = useState(themesFromStore.data);
    const [themes, setThemes] = useState(Object.keys(data));
    const [newGeneration, setNewGeneration] = useState([])
    const [generationNumber, setGenerationNumber] = useState(0)
    const [currentTheme, setCurrentTheme] = useState(props.currentTheme)


    const upVoteTheme = (selectedTheme, setLiked) => {
        setLiked(!data[selectedTheme].good_this_generation)
        data[selectedTheme].good_this_generation = !data[selectedTheme].good_this_generation;
        setToLS("all-themes", data)
    }

    useEffect(() => {
        if(generationNumber == 0) return
        let newData = {}
        newGeneration.forEach( t => {
            newData[t.id] = t
        })
        console.log("New generation with ", Object.keys(newData).length, " elements")
        setCurrentTheme(newGeneration[0])
        setData(newData)
        setThemes(Object.keys(newData))
    }, [generationNumber])

    /**
     * 1. Get the user picks, assign score 999999
     * 2. Calculate the distance of every non-pick from all picks and turn that into a score
     * 3. sort by Score and only keep the top 50
     * 4. cross-breed them
     * 5. generate random missing population
     */
    const goToNextGeneration = (themeData) => {
        let userPicks = Object.values(themeData).filter(t => {
            return t.good_this_generation == true
        })
        let restOfPopulation = Object.values(themeData).filter(t => {
            return t.good_this_generation != true
        })
        let newData = calculateDistances(userPicks, restOfPopulation)

        newData = newData.sort((a, b) => b.score - a.score )

        let top50 = newData.slice(0, 50)
        let newPopulation = breedPopulation(top50)
        newPopulation = calculateDistances(userPicks, newPopulation)

        let newRandomPopulation = generateRandomPopulation(75)
        return [...newPopulation, ...Object.values(newRandomPopulation.data)]

    }

    function resetSelections(_data) {
        themes.forEach( tId => {
            _data[tId].good_this_generation = false;
        })
    }

    const ThemeCard = props => {
        const [liked, setLiked] = useState(false)
        return(
            <Wrapper style={{backgroundColor: `${data[(props.theme.id)].colors.body}`, 
                    color: `${data[(props.theme.id)].colors.text}`, 
                    fontFamily: `${data[(props.theme.id)].font}`}}>
                    <span>{props.theme.name}</span>
                <ThemedButton onClick={ () => upVoteTheme(props.theme.id, setLiked) }
                    style={{backgroundColor: `${data[(props.theme.id)].colors.button.background}`, 
                    color: `${data[(props.theme.id)].colors.button.text}`,
                    fontFamily: `${data[(props.theme.id)].font}`}}>
                    UpVote me {/*({props.theme.score})*/}
                    {liked ? '✅' : ''}
                </ThemedButton>
                <ThemedButton onClick={ () => console.log(data[props.theme.id]) }
                    style={{backgroundColor: `${data[(props.theme.id)].colors.button.background}`, 
                    color: `${data[(props.theme.id)].colors.button.text}`,
                    fontFamily: `${data[(props.theme.id)].font}`}}>
                   Get this theme 
                </ThemedButton>

            </Wrapper>
        )
    }



    return (
        <div>
            <Header>Generate the ideal theme using your favorite ones from below (Generation #{generationNumber})</Header>
            <ThemedButton onClick={ () => { 
                setNewGeneration(goToNextGeneration(data))
                setGenerationNumber(generationNumber + 1)
                resetSelections(data)
            } }
                    style={{backgroundColor: `${data[(currentTheme.id)].colors.button.background}`, 
                    color: `${data[(currentTheme.id)].colors.button.text}`,
                    fontFamily: `${data[(currentTheme.id)].font}`}}>Go to next generation</ThemedButton>
            <Container>
            {
                themes.length > 0 && 
                    themes.map(theme =>(
                        <ThemeCard theme={data[theme]} key={data[theme].id} />
                    ))
            }
            </Container>
        </div>
    )
}