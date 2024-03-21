-- EventWithLocation: Gathers events with location and sport details
WITH EventWithLocation AS (

  SELECT 
      t.id AS event_id, 
      t.name AS name, 
      t.icon as icon, 
      l.name AS location_name, 
      sport.name as sport_name,
      event_type.sport_type as event_type
    FROM 
      event_generic t 
      JOIN location l ON t.location_id = l.id 
      JOIN sport ON t.sport_id = sport.id
      JOIN event_type on event_type.id = t.id
     
  UNION ALL 

  -- First Select: Finds events teams
  SELECT 
    t.id AS event_id, 
    CONCAT(t1.name, ' vs ', t2.name) AS name, 
    t1.icon as icon, 
    l.name AS location_name, 
    sport.name as sport_name,
    event_type.sport_type as event_type
  FROM 
    event_team t 
    JOIN team t1 ON t.home_team_id = t1.id 
    JOIN team t2 ON t.away_team_id = t2.id 
    JOIN location l ON t.location_id = l.id 
    JOIN sport ON t.sport_id = sport.id 
    JOIN event_type on event_type.id = t.id

  UNION ALL 

  -- Second Select: Finds events players
  SELECT 
    p.id AS event_id, 
    CONCAT(pl1.name, ' vs ', pl2.name) AS name, 
    ch.icon as icon, 
    l.name AS location_name, 
    sport.name as sport_name,
    event_type.sport_type as event_type
  FROM 
    event_player p 
    JOIN player pl1 ON p.player1_id = pl1.id 
    JOIN player pl2 ON p.player2_id = pl2.id 
    JOIN location l ON p.location_id = l.id 
    JOIN championship ch on p.championship_id = ch.id 
    JOIN sport on sport.id = p.sport_id
    JOIN event_type on event_type.id = p.id

),

-- LowestPriceTicket: Finds the lowest ticket price for each event
LowestPriceTicket AS (
  SELECT 
    event_id, 
    MIN(price) AS lowest_price 
  FROM 
    event_ticket 
  GROUP BY 
    event_id
) 

-- Final Select: Combines event details with the lowest ticket price
SELECT 
  ewl.event_id, 
  ewl.icon, 
  ewl.event_type,
  ewl.sport_name, 
  ewl.name, 
  ewl.location_name, 
  lpt.lowest_price 
FROM 
  EventWithLocation ewl 
  LEFT JOIN LowestPriceTicket lpt ON ewl.event_id = lpt.event_id;