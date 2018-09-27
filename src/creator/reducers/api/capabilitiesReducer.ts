import { requestsReducer } from 'redux-saga-requests';
import { ApiAction } from '../../actions';
import Runtime from '../../models/Runtime';
import { AppState, FetchedData } from '../../states';
import { createSelector } from 'reselect';
import Capability from '../../models/Capability';
import { getSelectedRuntime } from '../wizardReducer';

// Reducer

export const capabilitiesReducer = requestsReducer({ actionType: ApiAction.FETCH_CAPABILITIES, multiple: true });

// Selectors

function createCapabilityFilterForRuntime(r?: Runtime): (Capability) => boolean {
  return (c) => !r || Boolean(c.props.runtime && c.props.runtime.values.find(p => p.id === r.id));
}

const getCapabilitiesState = (state:AppState) => state.capabilities;

export const getCapabilitiesData = createSelector([getCapabilitiesState], (f) => ({
  data: f.data,
  loading: f.pending > 0,
  error: f.error,
} as FetchedData<Capability[]>));

export const getCapabilitiesDataForSelectedRuntime = createSelector([getCapabilitiesData, getSelectedRuntime], (c, r) => ({
  data: c.data.filter(createCapabilityFilterForRuntime(r)),
  loading: c.loading,
  error: c.error,
} as FetchedData<Capability[]>));